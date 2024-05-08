import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testf';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument;

  constructor(private loginSheet: MatBottomSheet,
      private router: Router
    ){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              console.log('User signed in:', user.uid, user.email);
            },
            whenSignedOut: user => {
              AppComponent.userDocument??"";
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"]);
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            },
            whenChanged: user => {

            }
          }
        );
      }
    );
  }
  public static getUserDocument(){
    return AppComponent.userDocument;
  }
  getUsername(){
    try {
      return AppComponent.userDocument.lastName;
    } catch (err) {
      return "Anonymous"
    }
  }

  getUserProfile(){
    return new Promise<number>(
      (resolved, rejected) => {
        this.firestore.listenToDocument(
          {
            name: "Getting Document",
            path: ["Users", this.auth.getAuth().currentUser?.uid??"" ] ,
            onUpdate: (result) => {
              AppComponent.userDocument = <UserDocument>result.data();
              this.userHasProfile = result.exists;
              AppComponent.userDocument.userId  = this.auth.getAuth().currentUser?.uid??"";
              if(this.userHasProfile) {
                //this.router.navigate(["postfeed"]);
                resolved(1);
              } else {
                resolved(0);
              }
            }
          }
        );
      }
    );
  }

  /*add(number1, number2) {
    return number1 + number2;
  }*/
  onLogoutClick(){
    this.auth.signOut();
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string;
  imageUrl:string;
  firstName: string;
  lastName: string;
  university: string;
  email: string;
  specialization: string;
  lab: string;
  phone: string;
  role: string;
}
