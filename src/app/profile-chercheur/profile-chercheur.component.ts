import { Component, OnInit } from '@angular/core';
import { UserDocument } from '../app.component';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-chercheur',
  templateUrl: './profile-chercheur.component.html',
  styleUrls: ['./profile-chercheur.component.css']
})
export class ProfileChercheurComponent implements OnInit {
  userProfileData: UserDocument | null = null;
  firstNameInput: string = '';
  lastNameInput: string = '';
  universityInput: string = '';
  emailInput: string = '';
  specializationInput: string = '';
  labInput: string = '';
  phoneInput: string = '';
  storage: FirebaseTSStorage;
  showProfile: boolean = false; // Add this flag

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor(private router: Router) {
    this.firestore = new FirebaseTSFirestore(); // Initialize Firestore service
    this.auth = new FirebaseTSAuth(); // Initialize Auth service
    this.storage = new FirebaseTSStorage();
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

  updateUserProfile() {
    const user = this.auth.getAuth().currentUser;
    if (user) {
      const userId = user.uid;
      const userDataToUpdate: Partial<UserDocument> = {};

      if (this.firstNameInput) userDataToUpdate.firstName = this.firstNameInput;
      if (this.lastNameInput) userDataToUpdate.lastName = this.lastNameInput;
      if (this.universityInput) userDataToUpdate.university = this.universityInput;
      if (this.emailInput) userDataToUpdate.email = this.emailInput;
      if (this.specializationInput) userDataToUpdate.specialization = this.specializationInput;
      if (this.labInput) userDataToUpdate.lab = this.labInput;
      if (this.phoneInput) userDataToUpdate.phone = this.phoneInput;

      this.firestore.update({
        path: ['Users', userId],
        data: userDataToUpdate,
        onComplete: () => {
          console.log('User profile updated successfully!');
          this.fetchUserProfileData(userId);
        }
      });
    }
  }

  updateProfilePicture(event: any) {
    const user = this.auth.getAuth().currentUser;
    if (user && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const filePath = `profile-images/${user.uid}/${file.name}`;

      // Upload file to Firebase Storage
      this.storage.upload({
        uploadName: file.name,
        path: ['profile-images', user.uid],
        data: {
          data: file,
          metadata: { /* Optional metadata */ }
        },
        onComplete: (downloadUrl) => {
          // Update user profile with the new image URL
          this.firestore.update({
            path: ['Users', user.uid],
            data: { imageUrl: downloadUrl },
            onComplete: () => {
              console.log('Profile picture updated successfully!');
              this.fetchUserProfileData(user.uid); // Refresh profile data after update
            }
          });
        },
        onFail: (error) => {
          console.error('Error uploading profile picture:', error);
        }
      });
    }
  }

  openFileInput() {
    const fileInput = document.getElementById('profile-picture-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  showUserProfile() {
    this.showProfile = true;
  }
}
