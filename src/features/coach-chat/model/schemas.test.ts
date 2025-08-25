import { describe, it, expect } from 'vitest';
import { Intent, Message, Session, CoachRequest, CoachResponse } from './schemas';

describe('Coach Chat Schemas', () => {
  describe('Intent', () => {
    it('should parse valid intents', () => {
      expect(Intent.parse('suggestMeal')).toBe('suggestMeal');
      expect(Intent.parse('addMeal')).toBe('addMeal');
      expect(Intent.parse('logWater')).toBe('logWater');
      expect(Intent.parse('explainNutrient')).toBe('explainNutrient');
      expect(Intent.parse('suggestBundle')).toBe('suggestBundle');
    });

    it('should reject invalid intents', () => {
      expect(() => Intent.parse('invalid')).toThrow();
    });
  });

  describe('Message', () => {
    it('should parse valid message', () => {
      const validMessage = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'user',
        content: 'Hello',
        createdAt: new Date().toISOString(),
      };

      const result = Message.parse(validMessage);
      expect(result).toEqual(validMessage);
    });

    it('should parse message with intents', () => {
      const messageWithIntents = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        role: 'assistant',
        content: 'Hello',
        createdAt: new Date().toISOString(),
        intents: ['suggestMeal', 'addMeal'],
      };

      const result = Message.parse(messageWithIntents);
      expect(result.intents).toEqual(['suggestMeal', 'addMeal']);
    });

    it('should reject message without required fields', () => {
      expect(() => Message.parse({})).toThrow();
    });
  });

  describe('Session', () => {
    it('should parse valid session', () => {
      const validSession = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'My Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = Session.parse(validSession);
      expect(result).toEqual(validSession);
    });

    it('should parse session with lastMessage', () => {
      const sessionWithLastMessage = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'My Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: 'Last message',
      };

      const result = Session.parse(sessionWithLastMessage);
      expect(result.lastMessage).toBe('Last message');
    });
  });

  describe('CoachRequest', () => {
    it('should parse valid request', () => {
      const validRequest = {
        message: 'Hello coach',
      };

      const result = CoachRequest.parse(validRequest);
      expect(result.message).toBe('Hello coach');
    });

    it('should parse request with sessionId', () => {
      const requestWithSession = {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        message: 'Hello coach',
      };

      const result = CoachRequest.parse(requestWithSession);
      expect(result.sessionId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should parse request with context', () => {
      const requestWithContext = {
        message: 'Hello coach',
        context: {
          page: 'diary',
          dateISO: '2024-01-01',
        },
      };

      const result = CoachRequest.parse(requestWithContext);
      expect(result.context?.page).toBe('diary');
      expect(result.context?.dateISO).toBe('2024-01-01');
    });

    it('should reject empty message', () => {
      expect(() => CoachRequest.parse({ message: '' })).toThrow();
    });
  });

  describe('CoachResponse', () => {
    it('should parse valid response', () => {
      const validResponse = {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        reply: 'Hello! How can I help?',
        intents: ['suggestMeal'],
      };

      const result = CoachResponse.parse(validResponse);
      expect(result).toEqual(validResponse);
    });

    it('should parse response without intents', () => {
      const responseWithoutIntents = {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        reply: 'Hello! How can I help?',
      };

      const result = CoachResponse.parse(responseWithoutIntents);
      expect(result.intents).toEqual([]);
    });
  });
});
