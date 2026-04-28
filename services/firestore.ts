import { firestore } from '@/services/firebase';
import { addDoc, collection, doc, getDoc, getDocs, query, QueryFieldFilterConstraint, setDoc, updateDoc } from 'firebase/firestore';

export async function saveItem(collectionKey: string, item: object) {
  const docRef = await addDoc(collection(firestore, collectionKey), item);
  return docRef.id;
}

export async function saveAsItem(collectionKey: string, id: string, item: object) {
  await setDoc(doc(firestore, collectionKey, id), item);
}

export async function updateItem(collectionKey: string, id: string, data: object) {
  const docRef = doc(firestore, collectionKey, id);
  await updateDoc(docRef, {
    ...data,
  });
}

export async function getItem<T>(collectionKey: string, id: string) {
  const docRef = await getDoc(doc(firestore, collectionKey, id));
  if (docRef.exists()) {
    return {
      id: docRef.id,
      ...docRef.data,
    } as T;
  } else {
    return null;
  }
}

export async function getItems<T>(collectionKey: string, queryConstraints: QueryFieldFilterConstraint[] = []) {
  const q = query(collection(firestore, collectionKey), ...queryConstraints);

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as T;
  });
}