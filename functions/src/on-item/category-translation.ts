import { v2 } from '@google-cloud/translate';
import { firestore } from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { Category } from '../categories/category.interface';

const translateClient = new v2.Translate();

/**
 * Determine if translation is needed based on document state
 * @param before Previous document state
 * @param after Current document state
 * @returns true if translation should be performed
 */
export function shouldTranslateCategory(
  before: Category | undefined,
  after: Category | undefined,
): boolean {
  // Document was deleted
  if (!after) {
    return false;
  }

  // No name to translate
  if (!after.name?.trim()) {
    return false;
  }

  // New document with name
  if (!before) {
    return true;
  }

  // Name changed
  if (before.name !== after.name) {
    return true;
  }

  // Name unchanged but translations missing or incomplete
  if (!after.name_sv || !after.name_en) {
    return true;
  }

  return false;
}

/**
 * Check if computed translations match existing fields
 * @param nameSv Swedish translation to compare
 * @param nameEn English translation to compare
 * @param existing Current category document
 * @returns true if translations match existing values
 */
export function translationsMatch(
  nameSv: string | undefined,
  nameEn: string | undefined,
  existing: Category,
): boolean {
  return nameSv === existing.name_sv && nameEn === existing.name_en;
}

/**
 * Translate a category name to Swedish and English
 * @param text Text to translate (typically the category name)
 * @returns Object with Swedish and English translations
 */
export async function translateCategoryName(text: string): Promise<{
  sv: string | undefined;
  en: string | undefined;
}> {
  try {
    // Google Cloud Translate expects an array of strings
    const [translations] = await translateClient.translate([text], {
      to: 'sv',
    });

    const svTranslation = Array.isArray(translations) ? translations[0] : (translations as unknown as string);

    const [englishTranslations] = await translateClient.translate([text], {
      to: 'en',
    });

    const enTranslation = Array.isArray(englishTranslations)
      ? englishTranslations[0]
      : (englishTranslations as unknown as string);

    return {
      sv: svTranslation || undefined,
      en: enTranslation || undefined,
    };
  } catch (error) {
    console.error('Translation failed for text:', text, error);
    return { sv: undefined, en: undefined };
  }
}

/**
 * Build update object for category with translations
 * Excludes undefined values to avoid writing null fields
 */
export function buildCategoryUpdate(
  nameSv: string | undefined,
  nameEn: string | undefined,
): Record<string, string> {
  const update: Record<string, string> = {};
  if (nameSv !== undefined) {
    update.name_sv = nameSv;
  }
  if (nameEn !== undefined) {
    update.name_en = nameEn;
  }
  return update;
}

/**
 * Firestore trigger for automatic category name translation
 * Translates category name to Swedish and English on create or name update
 */
export const onCategoryTranslation = onDocumentWritten(
  { document: '/categories/{categoryId}', region: 'europe-north1' },
  async (event) => {
    const before = event.data?.before.data() as Category | undefined;
    const after = event.data?.after.data() as Category | undefined;
    const categoryId = event.params.categoryId;

    // Decide if translation is needed
    if (!shouldTranslateCategory(before, after)) {
      return;
    }

    try {
      // Translate the name
      const { sv: nameSv, en: nameEn } = await translateCategoryName(after!.name);

      // Check if translations match existing values to avoid unnecessary writes
      if (translationsMatch(nameSv, nameEn, after!)) {
        console.log(`Category ${categoryId}: Translations already match, skipping write.`);
        return;
      }

      // Build update object with only defined values
      const update = buildCategoryUpdate(nameSv, nameEn);

      if (Object.keys(update).length === 0) {
        console.log(`Category ${categoryId}: No translations to write.`);
        return;
      }

      // Write translations back to Firestore
      await firestore().doc(`categories/${categoryId}`).update(update);
      console.log(`Category ${categoryId}: Translations written successfully.`, update);
    } catch (error) {
      // Log translation failures without blocking the trigger
      console.error(`Category ${categoryId}: Translation failed`, error);
    }
  },
);
