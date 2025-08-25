import { IntentT } from '../model/schemas';
import { execIntent, getIntentDescription } from '../model/intents';

interface IntentBarProps {
  intents: IntentT[];
}

export function IntentBar({ intents }: IntentBarProps) {
  if (intents.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-4">
      {intents.map((intent) => (
        <button
          key={intent}
          onClick={() => execIntent(intent)}
          className="px-3 py-2 bg-brand/20 hover:bg-brand/30 text-brand rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2"
        >
          {getIntentDescription(intent)}
        </button>
      ))}
    </div>
  );
}
