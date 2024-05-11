import { Injectable } from '@angular/core';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore,Where  } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Observable, from  } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddRequestService {

  private collectionName = 'demandes';

  constructor(private firestore: FirebaseTSFirestore, private firebaseAuth: FirebaseTSAuth) { }

  addRequest(requestData: any): Promise<void> {
    const requestDataWithDefaults = { ...requestData};

    return new Promise<void>((resolve, reject) => {
      this.firestore.create(
        {
          path: [this.collectionName],
          data: requestDataWithDefaults, // Use modified data
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
  // Method to update the status of a request
  updateRequestStatus(requestId: string, status: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.update({
        path: [this.collectionName, requestId],
        data: status,
        onComplete: () => {
          console.log('Request status updated successfully');
          resolve();
        },
        onFail: (error) => {
          console.error('Error updating request status:', error);
          reject(error);
        },
      });
    });
  }
 // Method to fetch accepted requests by the chef
 getAcceptedRequestsByChef(): Observable<any[]> {
      return new Observable<any[]>((observer) => {
        this.firestore.getCollection({
          path: [this.collectionName],
          where: [new Where('isSubmittedByChef', '==', true)],
          onComplete: (querySnapshot) => {
            const requests = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log('Accepted requests by chef:', requests);
            observer.next(requests);
            observer.complete();
          },
          onFail: (error) => {
            console.error('Error fetching requests:', error);
            observer.error(error);
          },
        });
      });
    }

}
