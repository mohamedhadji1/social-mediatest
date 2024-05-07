import { Injectable } from '@angular/core';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Observable, from  } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddRequestService {

  private collectionName = 'demandes';

  constructor(private firestore: FirebaseTSFirestore, private firebaseAuth: FirebaseTSAuth) { }
  addRequest(requestData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.create(
        {
          path: [this.collectionName],
          data: requestData,
          onComplete: () => {
            console.log('Request added successfully');
            resolve();
          },
          onFail: (error) => {
            console.error('Error adding request:', error);
            reject(error);
          },
        },
      );
    });
  }
  // Method to fetch all requests
  getRequests(): Observable<any[]> {
    return from(
      new Promise<any[]>((resolve, reject) => {
        this.firestore.getCollection({
          path: [this.collectionName],
          where: [],
          onComplete: (result) => {
            const requests = result.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            resolve(requests);
          },
          onFail: (error) => {
            console.error('Error fetching requests:', error);
            reject(error);
          },
        });
      }),
    );
  }
}

