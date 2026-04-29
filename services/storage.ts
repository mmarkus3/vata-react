import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadBarcodeImage(
  companyId: string,
  productId: string,
  imageUri: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `barcodes/${companyId}/${productId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = snapshot.totalBytes
            ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            : 0;
          onProgress?.(Math.round(progress));
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Failed to upload barcode image:', error);
    throw new Error('Failed to upload barcode image');
  }
}

export async function deleteBarcodeImage(imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Failed to delete barcode image:', error);
    throw new Error('Failed to delete barcode image');
  }
}
