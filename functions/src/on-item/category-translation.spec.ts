/* eslint-disable @typescript-eslint/no-require-imports */

// We need to mock before importing the function that uses it
const mockTranslateFn = jest.fn();

jest.mock('@google-cloud/translate', () => ({
  v2: {
    Translate: jest.fn(() => ({
      translate: mockTranslateFn,
    })),
  },
}));

// All imports must come after jest.mock
import {
  buildCategoryUpdate,
  shouldTranslateCategory,
  translateCategoryName,
  translationsMatch,
} from './category-translation';

describe('Category Translation Helper Functions', () => {
  describe('shouldTranslateCategory', () => {
    it('should return false when document is deleted', () => {
      const before = { name: 'Test', description: '', company: 'c1' };
      const after = undefined;

      expect(shouldTranslateCategory(before, after)).toBe(false);
    });

    it('should return false when category has no name', () => {
      const after = { name: '', description: '', company: 'c1' };

      expect(shouldTranslateCategory(undefined, after)).toBe(false);
    });

    it('should return true when category is newly created with name', () => {
      const after = { name: 'New Category', description: '', company: 'c1' };

      expect(shouldTranslateCategory(undefined, after)).toBe(true);
    });

    it('should return true when category name is updated', () => {
      const before = { name: 'Old Name', description: '', company: 'c1' };
      const after = { name: 'New Name', description: '', company: 'c1' };

      expect(shouldTranslateCategory(before, after)).toBe(true);
    });

    it('should return true when name unchanged but translations missing', () => {
      const before = { name: 'Category', description: '', company: 'c1' };
      const after = { name: 'Category', description: '', company: 'c1' };

      expect(shouldTranslateCategory(before, after)).toBe(true);
    });

    it('should return true when only name_sv is missing', () => {
      const before = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_en: 'Category',
      };
      const after = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_en: 'Category',
      };

      expect(shouldTranslateCategory(before, after)).toBe(true);
    });

    it('should return true when only name_en is missing', () => {
      const before = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
      };
      const after = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
      };

      expect(shouldTranslateCategory(before, after)).toBe(true);
    });

    it('should return false when name unchanged and translations present', () => {
      const before = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
        name_en: 'Category',
      };
      const after = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
        name_en: 'Category',
      };

      expect(shouldTranslateCategory(before, after)).toBe(false);
    });
  });

  describe('translationsMatch', () => {
    it('should return true when translations match existing fields', () => {
      const category = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
        name_en: 'Category',
      };

      expect(translationsMatch('Kategori', 'Category', category)).toBe(true);
    });

    it('should return false when Swedish translation does not match', () => {
      const category = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
        name_en: 'Category',
      };

      expect(translationsMatch('Kategor', 'Category', category)).toBe(false);
    });

    it('should return false when English translation does not match', () => {
      const category = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
        name_en: 'Category',
      };

      expect(translationsMatch('Kategori', 'Categor', category)).toBe(false);
    });

    it('should return false when translated value is undefined and existing is defined', () => {
      const category = {
        name: 'Category',
        description: '',
        company: 'c1',
        name_sv: 'Kategori',
      };

      expect(translationsMatch(undefined, 'Category', category)).toBe(false);
    });

    it('should return true when both are undefined and existing are also undefined', () => {
      const category = {
        name: 'Category',
        description: '',
        company: 'c1',
      };

      expect(translationsMatch(undefined, undefined, category)).toBe(true);
    });
  });

  describe('buildCategoryUpdate', () => {
    it('should build update with both translations', () => {
      const update = buildCategoryUpdate('Kategori', 'Category');

      expect(update).toEqual({
        name_sv: 'Kategori',
        name_en: 'Category',
      });
    });

    it('should only include defined Swedish translation', () => {
      const update = buildCategoryUpdate('Kategori', undefined);

      expect(update).toEqual({
        name_sv: 'Kategori',
      });
    });

    it('should only include defined English translation', () => {
      const update = buildCategoryUpdate(undefined, 'Category');

      expect(update).toEqual({
        name_en: 'Category',
      });
    });

    it('should return empty object when both translations are undefined', () => {
      const update = buildCategoryUpdate(undefined, undefined);

      expect(update).toEqual({});
    });
  });

  describe('translateCategoryName', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return translations from Google Cloud Translate', async () => {
      const { v2 } = require('@google-cloud/translate');
      const mockTranslateFn = jest.fn()
        .mockResolvedValueOnce([['Kategori']])
        .mockResolvedValueOnce([['Category']]);

      v2.Translate.mockImplementation(() => ({
        translate: mockTranslateFn,
      }));

      const result = await translateCategoryName('Test Category');

      expect(result).toEqual({
        sv: 'Kategori',
        en: 'Category',
      });
      expect(mockTranslateFn).toHaveBeenCalledTimes(2);
    });

    it('should return undefined for both on translation failure', async () => {
      const { v2 } = require('@google-cloud/translate');
      const mockTranslateFn = jest.fn().mockRejectedValue(new Error('Translation service error'));

      v2.Translate.mockImplementation(() => ({
        translate: mockTranslateFn,
      }));

      const result = await translateCategoryName('Test Category');

      expect(result).toEqual({
        sv: undefined,
        en: undefined,
      });
    });

    it('should handle empty translation results gracefully', async () => {
      const { v2 } = require('@google-cloud/translate');
      const mockTranslateFn = jest.fn()
        .mockResolvedValueOnce([['']])
        .mockResolvedValueOnce([['']]);

      v2.Translate.mockImplementation(() => ({
        translate: mockTranslateFn,
      }));

      const result = await translateCategoryName('Test Category');

      expect(result).toEqual({
        sv: undefined,
        en: undefined,
      });
    });

    it('should handle string response from translation API', async () => {
      const { v2 } = require('@google-cloud/translate');
      const mockTranslateFn = jest.fn()
        .mockResolvedValueOnce(['Kategori'])
        .mockResolvedValueOnce(['Category']);

      v2.Translate.mockImplementation(() => ({
        translate: mockTranslateFn,
      }));

      const result = await translateCategoryName('Test Category');

      expect(result).toEqual({
        sv: 'Kategori',
        en: 'Category',
      });
    });
  });
});
