import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'; // Import Firestore service
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'; // Import Auth service

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  university: string;
  email: string;
  specialization: string;
  lab: string;
  phone: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfileData: UserDocument | null = null;
  firstNameInput: string = '';
  lastNameInput: string = '';
  universityInput: string = '';
  emailInput: string = '';
  specializationInput: string = '';
  labInput: string = '';
  phoneInput: string = '';

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor() {
    this.firestore = new FirebaseTSFirestore(); // Initialize Firestore service
    this.auth = new FirebaseTSAuth(); // Initialize Auth service
  }

  ngOnInit(): void {
    this.auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in:", user.uid, user.email);
        this.fetchUserProfileData(user.uid);
      } else {
        console.error("No user is currently authenticated.");
      }
    });
  }

  fetchUserProfileData(userId: string) {
    this.firestore.getDocument({
      path: ['Users', userId],
      onComplete: (documentSnapshot) => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data() as UserDocument;
          this.userProfileData = userData;
          console.log("User Profile Data:", this.userProfileData);
        } else {
          console.log("User profile document does not exist.");
        }
      },
      onFail: (error) => {
        console.error("Failed to fetch user profile data:", error);
      }
    });
  }
}
