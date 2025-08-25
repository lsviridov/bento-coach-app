import { setupWorker } from 'msw/browser';
import { diaryHandlers } from './handlers.diary';
import { profileHandlers } from './handlers.profile';
import { shopHandlers } from './handlers.shop';
import { cameraHandlers } from './handlers.camera';
import { coachHandlers } from './handlers.coach';
import { homeHandlers } from './handlers.home';

export const worker = setupWorker(...diaryHandlers, ...profileHandlers, ...shopHandlers, ...cameraHandlers, ...coachHandlers, ...homeHandlers);

// Configure worker for MSW v2
worker.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

worker.events.on('response:mocked', ({ response, request }) => {
  console.log('MSW mocked response for:', request.method, request.url);
});

worker.events.on('request:unhandled', ({ request }) => {
  console.warn('MSW unhandled request:', request.method, request.url);
});

// Log when worker starts
worker.events.on('worker:start', () => {
  console.log('MSW worker started and ready to intercept requests');
});

// Log all registered handlers
console.log('MSW handlers registered:', [
  ...diaryHandlers.map(h => h.info.header),
  ...profileHandlers.map(h => h.info.header),
  ...shopHandlers.map(h => h.info.header),
  ...cameraHandlers.map(h => h.info.header),
  ...coachHandlers.map(h => h.info.header),
  ...homeHandlers.map(h => h.info.header)
]);
