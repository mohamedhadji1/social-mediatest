import { Injectable } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Observable, Subject  } from 'rxjs';
import { UserDocument } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private firestore = new FirebaseTSFirestore();
  private usersSubject = new Subject<UserDocument[]>();

constructor() {this.loadUsers(); }

private loadUsers(): void {
  this.firestore.getCollection({
    path: ['Users'],
    where : [],
    onComplete: (result) => {
      if (result.docs.length === 0) {
        console.warn('No users found in the collection.');
        this.usersSubject.next([]);
      } else {
        const users = result.docs.map((doc) => {
          const data = doc.data();
          // Ensure all fields are accessed correctly
          return {
            userId: doc.id,
            publicName: data['publicName'] || '',
            description: data['description'] || '',
            imageUrl: data['imageUrl'] || '',
            firstName: data['firstName'] || '',
            lastName: data['lastName'] || '',
            university: data['university'] || '',
            email: data['email'] || '',
            specialization: data['specialization'] || '',
            lab: data['lab'] || '',
            phone: data['phone'] || '',
            role: data['role'] || '',
          } as UserDocument;
        });

        this.usersSubject.next(users);
      }
    },
    onFail: (error) => {
      console.error('Error loading users:', error);
      this.usersSubject.next([]); // Return an empty array on failure
    },
  });
}
deleteUser(userId: string): Promise<void> {
  const documentPath = ['Users', userId];
  console.log(`Attempting to delete document at path: ${documentPath.join('/')}`);

  return new Promise<void>((resolve, reject) => {
    this.firestore.getDocument({
      path: documentPath,
      onComplete: (result) => {
        if (result.exists) {
          console.log(`Document found. Deleting...`);
          this.firestore.delete({
            path: documentPath,
            onComplete: () => {
              console.log(`Document at path ${documentPath.join('/')} deleted.`);
              resolve(); // Successful deletion
            },
            onFail: (error) => {
              console.error(`Error deleting document: ${error}`);
              reject(error);
            },
          });
        } else {
          console.warn(`Document at path ${documentPath.join('/')} does not exist.`);
          reject(new Error("Document not found"));
        }
      },
      onFail: (error) => {
        console.error(`Error getting document: ${error}`);
        reject(error);
      },
    });
  });
}

updateUser(user: UserDocument): Promise<void> {
  // The Firestore document path to update
  const documentPath = ['Users', user.userId];

  return new Promise<void>((resolve, reject) => {
    this.firestore.update({
      path: documentPath,
      data: {
        // Update these fields in Firestore
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        lab: user.lab,
        specialization: user.specialization,
        university: user.university,
        role: user.role,
      },
      onComplete: () => {
        console.log(`User with ID ${user.userId} updated successfully.`);
        resolve(); // Resolve the Promise when update is successful
      },
      onFail: (error) => {
        console.error(`Error updating user with ID ${user.userId}:`, error);
        reject(error); // Reject the Promise if an error occurs
      },
    });
  });
}

getUsers(): Observable<UserDocument[]> {
  return this.usersSubject.asObservable();
}
}
