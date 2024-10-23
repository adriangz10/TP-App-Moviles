import { Injectable } from '@angular/core';
import { collectionData, Firestore, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  getCollection(collectionName: string): Observable<any[]>{
    const coll = collection(this.firestore, collectionName);
    return collectionData(coll);
  }
}
