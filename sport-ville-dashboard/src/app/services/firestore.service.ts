// services/firestore.service.ts
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  Firestore,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

export class FirestoreService {
  private db: Firestore;

  constructor() {
    this.db = db;
  }

  // Ajouter ou mettre à jour un document
  async setDocument(collectionPath: string, docId: string, data: DocumentData): Promise<void> {
    await setDoc(doc(this.db, collectionPath, docId), data, { merge: true });
  }

  // Récupérer un document
  async getDocument<T>(collectionPath: string, docId: string): Promise<T | null> {
    const docRef = doc(this.db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as T : null;
  }

  // Supprimer un document
  async deleteDocument(collectionPath: string, docId: string): Promise<void> {
    await deleteDoc(doc(this.db, collectionPath, docId));
  }

  // Récupérer tous les documents d'une collection
  async getCollection<T>(collectionPath: string): Promise<T[]> {
    const q = query(collection(this.db, collectionPath));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as T);
  }

  // Requête avec conditions
  async queryCollection<T>(
    collectionPath: string, 
    field: string, 
    operator: WhereFilterOp, 
    value: any
  ): Promise<T[]> {
    const q = query(
      collection(this.db, collectionPath), 
      where(field, operator, value)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as T);
  }
}

export const firestoreService = new FirestoreService();