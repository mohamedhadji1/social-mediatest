import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { UserDocument } from 'src/app/app.component';

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

  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
    this.storage = new FirebaseTSStorage();
    this.show = false;
  }

  ngOnInit(): void {
  }

  onImageSelected(imageInput: HTMLInputElement) {
    if (imageInput.files && imageInput.files.length > 0) {
      this.selectedImage = imageInput.files[0];
    }
  }

  onContinueClick(
    nameInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement,
    imageInput: HTMLInputElement
  ) {
    let name = nameInput.value;
    let description = descriptionInput.value;
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
                  publicName: name,
                  description: description,
                  imageUrl: downloadUrl
                },
                onComplete: (docId) => {
                  alert("Profile Created");
                  nameInput.value = "";
                  descriptionInput.value = "";
                  imageInput.value = "";
                  this.selectedImage = null;
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
              publicName: name,
              description: description
            },
            onComplete: (docId) => {
              alert("Profile Created");
              nameInput.value = "";
              descriptionInput.value = "";
              imageInput.value = "";
              this.selectedImage = null;
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
}
