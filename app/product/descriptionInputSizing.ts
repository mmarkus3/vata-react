export const DESCRIPTION_DEFAULT_LINES = 3;
export const DESCRIPTION_LINE_HEIGHT = 24;
export const DESCRIPTION_VERTICAL_PADDING = 24;

export const getDescriptionMinHeight = (): number =>
  DESCRIPTION_DEFAULT_LINES * DESCRIPTION_LINE_HEIGHT + DESCRIPTION_VERTICAL_PADDING;

export const getDescriptionHeight = (contentHeight: number): number =>
  Math.max(getDescriptionMinHeight(), contentHeight);

export const isDescriptionField = (fieldName: string): boolean =>
  fieldName === 'description_fi' || fieldName === 'description_sv' || fieldName === 'description_en';
