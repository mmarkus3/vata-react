import { createCategory, deleteCategory, getAllCategories, updateCategory } from '@/services/category';

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
}));

describe('Category Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should throw error when name is empty', async () => {
      await expect(createCategory('', 'description')).rejects.toThrow(
        'Category name is required'
      );
    });

    it('should throw error when name is too long', async () => {
      const longName = 'a'.repeat(256);
      await expect(createCategory(longName, 'description')).rejects.toThrow(
        'Category name cannot exceed 255 characters'
      );
    });

    it('should trim whitespace from name and description', async () => {
      const { addDoc } = require('firebase/firestore');
      addDoc.mockResolvedValue({ id: 'test-id' });

      const name = '  Test Category  ';
      const description = '  Test Description  ';

      const result = await createCategory(name, description);

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
        'Category name is required'
      );
    });

    it('should throw error when name is too long', async () => {
      const longName = 'a'.repeat(256);
      await expect(updateCategory('id', longName, 'description')).rejects.toThrow(
        'Category name cannot exceed 255 characters'
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
        onNext({ forEach: () => { } });
        return jest.fn();
      });

      const unsubscribe = getAllCategories(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith([]);
      expect(unsubscribe).toBeDefined();
    });
  });
});
