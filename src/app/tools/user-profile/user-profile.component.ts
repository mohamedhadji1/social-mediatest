import { ProjectService } from './../../../services/Project.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'; // Import Firestore service
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'; // Import Auth service
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { Router } from '@angular/router';

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
  aboutMe: string;
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
  aboutMeInput: string = '';
  storage: FirebaseTSStorage;
  showProfile: boolean = false; // Add this flag
  displayProjects: boolean = false; // Initialize with a default value
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  totalProjects: number = 0;  // Variable to store the total number of projects
  constructor(
    private router: Router,
    private projectService: ProjectService // Inject ProjectService
  ) {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
    this.storage = new FirebaseTSStorage();
  }

  ngOnInit(): void {
    this.auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in:", user.uid, user.email);
        this.fetchUserProfileData(user.uid);
        this.loadTotalProjects(user.uid);
      } else {
        console.error("No user is currently authenticated.");
      }
    });
  }
  loadTotalProjects(userId: string): void {
    this.projectService.getTotalProjectsByUserId(userId).subscribe({
      next: (total: number) => {
        console.log(`Total projects loaded: ${total}`);
        this.totalProjects = total;
      },
      error: (err) => {
        console.error('Error fetching total projects:', err);
        // Additional error handling or retry logic can be added here
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
          this.fetchUserProfileData(userId); // Refresh profile data after update
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
        path: ['profile-images', user.uid], // Providing path as an array of strings
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
  displayProfileChercheur: boolean = true;

  toggleProfileChercheur(): void {
    this.displayProfileChercheur = true;
    this.displayProjects = false;
  }
  toggleProjects() {
    this.displayProjects = true;
    this.displayProfileChercheur = false;
  }
}
