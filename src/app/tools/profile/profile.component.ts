import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() show: boolean;
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
    this.show = false;
  }

  ngOnInit(): void {
  }

  onContinueClick(
    nameInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement
  ) {
    let name = nameInput.value;
    let description = descriptionInput.value;
    const auth = this.auth.getAuth();
    if (auth !== null && auth.currentUser !== null) {
      this.firestore.create({
        path: ["Users", auth.currentUser.uid],
        data: {
          publicName: name,
          description: description
        },
        onComplete: (docId) => {
          alert("Profile Created");
          nameInput.value = "";
          descriptionInput.value = "";
        },
        onFail: (err) => {
          // Handle failure
        }
      });
    } else {
      // Handle the case where auth or auth.currentUser is null
    }
  }

}
