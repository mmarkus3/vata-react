import { getCategoryDescription, hasInlineCategoryActions } from '@/components/categories/CategoryListItem';

describe('CategoryListItem helpers', () => {
  it('does not expose inline edit/delete actions', () => {
    expect(hasInlineCategoryActions).toBe(false);
  });

  it('returns description fallback when empty', () => {
    expect(
      getCategoryDescription({
        id: 'cat-1',
        name: 'Snacks',
        description: '',
        company: 'co-1',
      })
    ).toBe('-');
  });

  it('returns existing description when present', () => {
    expect(
      getCategoryDescription({
        id: 'cat-1',
        name: 'Snacks',
        description: 'Salty snacks',
        company: 'co-1',
      })
    ).toBe('Salty snacks');
  });
});
