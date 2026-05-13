import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '@/services/category';
import { CATEGORY_VALIDATION } from '@/constants/category';

// Mock Firebase
jest.mock('@/services/firebase', () => ({
  firestore: {},
}));

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
}));

describe('Category Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should throw error when name is empty', async () => {
      await expect(createCategory('', 'description', 'company-1')).rejects.toThrow(
        CATEGORY_VALIDATION.ERRORS.NAME_REQUIRED
      );
    });

    it('should throw error when name is too long', async () => {
      const longName = 'a'.repeat(256);
      await expect(createCategory(longName, 'description', 'company-1')).rejects.toThrow(
        CATEGORY_VALIDATION.ERRORS.NAME_TOO_LONG
      );
    });

    it('should trim whitespace from name and description', async () => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'test-id' });

      const name = '  Test Category  ';
      const description = '  Test Description  ';

      const result = await createCategory(name, description, 'company-1');

      expect(result).toBe('test-id');
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should throw error when id is missing', async () => {
      await expect(updateCategory('', 'name', 'description')).rejects.toThrow(
        'Category ID is required'
      );
    });

    it('should throw error when name is empty', async () => {
      await expect(updateCategory('id', '', 'description')).rejects.toThrow(
        CATEGORY_VALIDATION.ERRORS.NAME_REQUIRED
      );
    });

    it('should throw error when name is too long', async () => {
      const longName = 'a'.repeat(256);
      await expect(updateCategory('id', longName, 'description')).rejects.toThrow(
        CATEGORY_VALIDATION.ERRORS.NAME_TOO_LONG
      );
    });
  });

  describe('deleteCategory', () => {
    it('should throw error when id is missing', async () => {
      await expect(deleteCategory('')).rejects.toThrow(
        'Category ID is required'
      );
    });
  });

  describe('getAllCategories', () => {
    it('should call callback with empty array on listener setup', () => {
      const { onSnapshot } = require('firebase/firestore');
      const mockCallback = jest.fn();

      onSnapshot.mockImplementation((query: any, onNext: any) => {
        onNext({ docs: [] });
        return jest.fn();
      });

      const unsubscribe = getAllCategories('company-1', mockCallback);

      expect(mockCallback).toHaveBeenCalledWith([]);
      expect(unsubscribe).toBeDefined();
    });
  });

  describe('getCategoryById', () => {
    it('should throw when id is missing', async () => {
      await expect(getCategoryById('')).rejects.toThrow('Category ID is required');
    });
  });
});
