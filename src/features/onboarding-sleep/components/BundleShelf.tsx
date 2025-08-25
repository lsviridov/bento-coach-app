import React, { useState } from 'react';
import { trackBundleViewed, trackBundleSaved } from '../services/analytics';

interface Bundle {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  imageUrl?: string;
}

interface BundleShelfProps {
  bundleTags: string[];
  onClose: () => void;
}

// Mock bundle data - in a real app this would come from an API
const mockBundles: Bundle[] = [
  {
    id: 'b1',
    title: 'Evening Light Bundle',
    description: 'Gentle evening meals and snacks for better sleep',
    tags: ['evening-light', 'sugar-stable'],
    price: '$29.99'
  },
  {
    id: 'b2',
    title: 'Caffeine-Free Rituals',
    description: 'Herbal teas and evening routines to replace stimulants',
    tags: ['caffeine-free', 'evening-ritual'],
    price: '$24.99'
  },
  {
    id: 'b3',
    title: 'Low-Reflux Dinner',
    description: 'Gentle foods and supplements for digestive comfort',
    tags: ['low-reflux', 'gentle-gut'],
    price: '$34.99'
  },
  {
    id: 'b4',
    title: 'Sugar-Stable Evenings',
    description: 'Whole grains and protein-rich evening options',
    tags: ['sugar-stable', 'whole-grains'],
    price: '$27.99'
  },
  {
    id: 'b5',
    title: 'Magnesium-Rich Calm',
    description: 'Foods and supplements for relaxation and sleep',
    tags: ['magnesium-rich', 'calm-evening'],
    price: '$31.99'
  }
];

export const BundleShelf: React.FC<BundleShelfProps> = ({ bundleTags, onClose }) => {
  const [savedBundles, setSavedBundles] = useState<Set<string>>(new Set());

  // Filter bundles by tags
  const relevantBundles = mockBundles.filter(bundle =>
    bundle.tags.some(tag => bundleTags.includes(tag))
  );

  React.useEffect(() => {
    trackBundleViewed(bundleTags);
  }, [bundleTags]);

  const handleSaveBundle = (bundleId: string) => {
    setSavedBundles(prev => new Set(prev).add(bundleId));
    trackBundleSaved(bundleId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended Bundles</h2>
              <p className="text-gray-600">Based on your sleep profile</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close bundle shelf"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bundles */}
        <div className="p-6">
          {relevantBundles.length > 0 ? (
            <div className="space-y-4">
              {relevantBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {bundle.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {bundle.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {bundle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        {bundle.price}
                      </div>
                      <button
                        onClick={() => handleSaveBundle(bundle.id)}
                        disabled={savedBundles.has(bundle.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          savedBundles.has(bundle.id)
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {savedBundles.has(bundle.id) ? 'Saved!' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bundles found</h3>
              <p className="text-gray-500">
                We're working on creating bundles for your profile
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
