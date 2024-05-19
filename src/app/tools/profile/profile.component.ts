import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean;
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  storage: FirebaseTSStorage;
  selectedImage: File | null = null;
  userEmail: string = '';
  constructor(private router: Router) {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
    this.storage = new FirebaseTSStorage();
    this.show = false;
  }

  ngOnInit(): void {
    this.auth.getAuth().onAuthStateChanged(user => {
      if (user) {
        this.userEmail = user.email || ''; 
        console.log('User signed in:', user.uid, user.email);
      } else {
        console.log('No user is signed in.');
      }
    });
  }

  onImageSelected(imageInput: HTMLInputElement) {
    if (imageInput.files && imageInput.files.length > 0) {
      this.selectedImage = imageInput.files[0];
    }
  }

  onContinueClick(
    firstNameInput: HTMLInputElement,
    lastNameInput: HTMLInputElement,
    universityInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    specializationInput: HTMLInputElement,
    labInput: HTMLInputElement,
    phoneInput: HTMLInputElement,
    imageInput: HTMLInputElement,
    aboutMeInput: HTMLTextAreaElement
  ) {
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let university = universityInput.value;
    let email = emailInput.value;
    let specialization = specializationInput.value;
    let lab = labInput.value;
    let phone = phoneInput.value;
    let aboutMe = aboutMeInput.value;
    const auth = this.auth.getAuth();
    if (auth !== null) {
      const currentUser = auth.currentUser;
      if (currentUser !== null) {
        if (this.selectedImage) {
          const imagePath = [`profile-images`, currentUser.uid, this.selectedImage.name];
          this.storage.upload({
            uploadName: "Upload Profile Image",
            path: imagePath,
            data: {
              data: this.selectedImage
            },
            onComplete: (downloadUrl) => {
              this.firestore.create({
                path: ["Users", currentUser.uid],
                data: {
                  firstName: firstName,
                  lastName: lastName,
                  university: university,
                  email: email,
                  specialization: specialization,
                  lab: lab,
                  phone: phone,
                  imageUrl: downloadUrl,
                  aboutMe: aboutMe,
                  role: 'chercheur'
                },
                onComplete: (docId) => {
                  alert("Profile Created");
                  this.resetForm(firstNameInput, lastNameInput, universityInput, emailInput, specializationInput, labInput, phoneInput, imageInput,aboutMeInput);
                },
                onFail: (err) => {
                  // Handle failure
                }
              });
            }
          });
        } else {
          this.firestore.create({
            path: ["Users", currentUser.uid],
            data: {
              firstName: firstName,
              lastName: lastName,
              university: university,
              email: email,
              specialization: specialization,
              lab: lab,
              phone: phone,
              aboutMe: aboutMe
            },
            onComplete: (docId) => {
              alert("Profile Created");
              this.resetForm(firstNameInput, lastNameInput, universityInput, emailInput, specializationInput, labInput, phoneInput, imageInput,aboutMeInput);
              this.router.navigate(['/home']);
            },
            onFail: (err) => {
              // Handle failure
            }
          });
        }
      } else {
        // Handle the case where currentUser is null
      }
    } else {
      // Handle the case where auth is null
    }
  }

  resetForm(
    firstNameInput: HTMLInputElement,
    lastNameInput: HTMLInputElement,
    universityInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    specializationInput: HTMLInputElement,
    labInput: HTMLInputElement,
    phoneInput: HTMLInputElement,
    imageInput: HTMLInputElement,
    aboutMeInput: HTMLTextAreaElement,

  ) {
    firstNameInput.value = "";
    lastNameInput.value = "";
    universityInput.value = "";
    emailInput.value = "";
    specializationInput.value = "";
    labInput.value = "";
    phoneInput.value = "";
    imageInput.value = "";
    aboutMeInput.value = "";
    this.selectedImage = null;
  }
}
