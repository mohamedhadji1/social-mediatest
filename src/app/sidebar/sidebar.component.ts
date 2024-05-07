import { UserDocument } from 'src/app/app.component';
import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  //@Input() user: UserDocument = { publicName: '', description: '', userId: '', imageUrl: '' }; // Initialize the user property

  userProfileData: UserDocument | null = null;
  opened: boolean = false;
  loadedUser: UserDocument | undefined;
  userImageUrl: string | null = null;
  constructor(
    private firestore: FirebaseTSFirestore,
    private auth: FirebaseTSAuth,
    private router: Router,
  ) {}

  ngOnInit(): void {
   /* if (this.user) {
      //this.getCreatorInfo(this.user.userId);
      console.log(this.userImageUrl)
    }*/
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

  /*getCreatorInfo(creatorId: string) {
    this.firestore.getDocument({
      path: ['Users', creatorId],
      onComplete: (result) => {
        if (result && result.data()) {
          const userData = result.data() as UserDocument;
          this.loadedUser = {
            publicName: userData.publicName,
            description: userData.description,
            userId: userData.userId,
            imageUrl: userData.imageUrl
          };

        }
      },
    });
  }*/

  toggleSidebar() {
    this.opened = !this.opened;
  }
  logout() {
    this.auth.signOut().then(() => {
      //this.router.navigate(['/login']);
    });
  }
}
