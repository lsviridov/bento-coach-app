import { IntentT } from './schemas';

export interface IntentAction {
  type: IntentT;
  payload?: any;
  description: string;
}

export function execIntent(intent: IntentT, payload?: any): void {
  switch (intent) {
    case 'addMeal':
      // TODO: openModal('add-meal', presetFromCoach(payload));
      console.log('Intent: addMeal', payload);
      break;
      
    case 'logWater':
      // TODO: water.add(250) - добавить 250мл воды
      console.log('Intent: logWater', payload);
      break;
      
    case 'suggestMeal':
      // TODO: показать подбор рецепта/рациона
      console.log('Intent: suggestMeal', payload);
      break;
      
    case 'suggestBundle':
      // TODO: cart.add(sku...), openCartDrawer()
      console.log('Intent: suggestBundle', payload);
      break;
      
    case 'explainNutrient':
      // TODO: показать тултип/модал с пояснением
      console.log('Intent: explainNutrient', payload);
      break;
      
    default:
      console.warn('Unknown intent:', intent);
  }
}

export function getIntentDescription(intent: IntentT): string {
  const descriptions: Record<IntentT, string> = {
    suggestMeal: 'Предложить блюдо',
    addMeal: 'Добавить приём пищи',
    logWater: 'Записать воду',
    explainNutrient: 'Объяснить нутриент',
    suggestBundle: 'Рекомендовать товары'
  };
  
  return descriptions[intent];
}
