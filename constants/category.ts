/**
 * Category-related validation rules and error messages
 */

export const CATEGORY_VALIDATION = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 500,

  ERRORS: {
    NAME_REQUIRED: 'Kategorian nimi on pakollinen',
    NAME_TOO_LONG: 'Kategorian nimi maksimissaan 255 merkkiä',
    NAME_DUPLICATE: 'Kategorian nimi on jo olemassa',
    DESCRIPTION_TOO_LONG: 'Kuvaus maksimissaan 500 merkkiä',
    CREATE_FAILED: 'Failed to create category',
    UPDATE_FAILED: 'Failed to update category',
    DELETE_FAILED: 'Failed to delete category',
    FETCH_FAILED: 'Failed to fetch categories',
  },

  SUCCESS: {
    CREATED: 'Kategoria luotu',
    UPDATED: 'Kategoria päivitetty',
    DELETED: 'Kategoria poistettu',
  },
} as const;
