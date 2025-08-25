import { SectionCard } from './section-card';

export const ColorShowcase = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-ink mb-4">
          Новая цветовая палитра
        </h1>
        <p className="text-lg text-muted-600 max-w-2xl mx-auto">
          Современная и гармоничная палитра с улучшенной доступностью и визуальной привлекательностью
        </p>
      </div>

      {/* Brand Colors */}
      <SectionCard variant="brand" className="p-6">
        <h2 className="text-2xl font-display font-semibold mb-4">Brand Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="text-center">
              <div 
                className={`w-16 h-16 rounded-lg mx-auto mb-2 bg-brand-${shade} border border-surface-200`}
                style={{ backgroundColor: `hsl(var(--brand-${shade}))` }}
              />
              <p className="text-xs font-mono text-muted-600">brand-{shade}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Accent Colors */}
      <SectionCard variant="accent" className="p-6">
        <h2 className="text-2xl font-display font-semibold mb-4">Accent Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="text-center">
              <div 
                className={`w-16 h-16 rounded-lg mx-auto mb-2 bg-accent-${shade} border border-surface-200`}
                style={{ backgroundColor: `hsl(var(--accent-${shade}))` }}
              />
              <p className="text-xs font-mono text-muted-600">accent-{shade}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Surface Colors */}
      <SectionCard variant="default" className="p-6">
        <h2 className="text-2xl font-display font-semibold mb-4">Surface Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="text-center">
              <div 
                className={`w-16 h-16 rounded-lg mx-auto mb-2 bg-surface-${shade} border border-surface-200`}
                style={{ backgroundColor: `hsl(var(--surface-${shade}))` }}
              />
              <p className="text-xs font-mono text-muted-600">surface-{shade}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Status Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard variant="default" className="p-6">
          <h3 className="text-xl font-display font-semibold mb-4 text-success-600">Success Colors</h3>
          <div className="grid grid-cols-2 gap-3">
            {[50, 100, 200, 300, 400, 500].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-12 h-12 rounded-lg mx-auto mb-2 bg-success-${shade} border border-surface-200`}
                  style={{ backgroundColor: `hsl(var(--success-${shade}))` }}
                />
                <p className="text-xs font-mono text-muted-600">success-{shade}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard variant="default" className="p-6">
          <h3 className="text-xl font-display font-semibold mb-4 text-warning-600">Warning Colors</h3>
          <div className="grid grid-cols-2 gap-3">
            {[50, 100, 200, 300, 400, 500].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-12 h-12 rounded-lg mx-auto mb-2 bg-warning-${shade} border border-surface-200`}
                  style={{ backgroundColor: `hsl(var(--warning-${shade}))` }}
                />
                <p className="text-xs font-mono text-muted-600">warning-{shade}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard variant="default" className="p-6">
          <h3 className="text-xl font-display font-semibold mb-4 text-danger-600">Danger Colors</h3>
          <div className="grid grid-cols-2 gap-3">
            {[50, 100, 200, 300, 400, 500].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-12 h-12 rounded-lg mx-auto mb-2 bg-danger-${shade} border border-surface-200`}
                  style={{ backgroundColor: `hsl(var(--danger-${shade}))` }}
                />
                <p className="text-xs font-mono text-muted-600">danger-{shade}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Text Colors */}
      <SectionCard variant="default" className="p-6">
        <h2 className="text-2xl font-display font-semibold mb-4">Text Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-lg mx-auto mb-2 bg-ink text-white flex items-center justify-center font-bold">
              Ink
            </div>
            <p className="text-xs font-mono text-muted-600">text-ink</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-lg mx-auto mb-2 bg-muted-500 text-white flex items-center justify-center font-bold">
              Muted
            </div>
            <p className="text-xs font-mono text-muted-600">text-muted</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-lg mx-auto mb-2 bg-brand text-white flex items-center justify-center font-bold">
              Brand
            </div>
            <p className="text-xs font-mono text-muted-600">text-brand</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-lg mx-auto mb-2 bg-accent text-white flex items-center justify-center font-bold">
              Accent
            </div>
            <p className="text-xs font-mono text-muted-600">text-accent</p>
          </div>
        </div>
      </SectionCard>

      {/* Shadows */}
      <SectionCard variant="default" className="p-6">
        <h2 className="text-2xl font-display font-semibold mb-4">Shadows</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 rounded-lg mx-auto mb-2 bg-surface shadow-soft"></div>
            <p className="text-xs font-mono text-muted-600">shadow-soft</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-lg mx-auto mb-2 bg-surface shadow-md"></div>
            <p className="text-xs font-mono text-muted-600">shadow-md</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-lg mx-auto mb-2 bg-surface shadow-lg"></div>
            <p className="text-xs font-mono text-muted-600">shadow-lg</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-lg mx-auto mb-2 bg-surface shadow-xl"></div>
            <p className="text-xs font-mono text-muted-600">shadow-xl</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
