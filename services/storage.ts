import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadBarcodeImage(companyId: string, productId: string, imageUri: string, fileName: string): Promise<string> {
  try {
    // Convert imageUri to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `barcodes/${companyId}/${productId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Failed to upload barcode image:', error);
    throw new Error('Failed to upload barcode image');
  }
}