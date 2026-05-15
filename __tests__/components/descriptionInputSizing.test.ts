import {
  DESCRIPTION_DEFAULT_LINES,
  getDescriptionHeight,
  getDescriptionMinHeight,
  isDescriptionField,
} from '@/app/product/descriptionInputSizing';

describe('description input sizing', () => {
  it('uses 3 lines as the default baseline', () => {
    expect(DESCRIPTION_DEFAULT_LINES).toBe(3);
    expect(getDescriptionMinHeight()).toBeGreaterThan(0);
  });

  it('keeps minimum height for short content', () => {
    const minHeight = getDescriptionMinHeight();
    expect(getDescriptionHeight(minHeight - 20)).toBe(minHeight);
  });

  it('grows height for longer content', () => {
    const minHeight = getDescriptionMinHeight();
    expect(getDescriptionHeight(minHeight + 40)).toBe(minHeight + 40);
  });

  it('identifies only description multilingual fields', () => {
    expect(isDescriptionField('description_fi')).toBe(true);
    expect(isDescriptionField('description_sv')).toBe(true);
    expect(isDescriptionField('description_en')).toBe(true);
    expect(isDescriptionField('ingredients_fi')).toBe(false);
  });
});
