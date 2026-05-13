import { getCategoryLabelFromReference, resolveCategoryIdFromReference } from '@/utils/categoryReference';

const categories = [
  { id: 'cat-1', name: 'Dairy', description: '', company: 'co-1' },
  { id: 'cat-2', name: 'Bakery', description: '', company: 'co-1' },
];

describe('categoryReference', () => {
  it('resolves id directly', () => {
    expect(resolveCategoryIdFromReference(categories as any, 'cat-1')).toBe('cat-1');
  });

  it('resolves legacy name to id', () => {
    expect(resolveCategoryIdFromReference(categories as any, 'Dairy')).toBe('cat-1');
  });

  it('returns original reference when unresolved', () => {
    expect(resolveCategoryIdFromReference(categories as any, 'Legacy')).toBe('Legacy');
  });

  it('returns label by id and fallback to raw value', () => {
    expect(getCategoryLabelFromReference(categories as any, 'cat-2')).toBe('Bakery');
    expect(getCategoryLabelFromReference(categories as any, 'Unknown')).toBe('Unknown');
  });
});
