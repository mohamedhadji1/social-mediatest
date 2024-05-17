import { Component } from '@angular/core';
import { AppComponent, UserDocument } from '../app.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AuthenticatorComponent } from '../tools/authenticator/authenticator.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
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
              AppComponent.getUserDocument().lastName = "";
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
    return AppComponent.getUserDocument();
  }
  getUsername(){
    try {
      return AppComponent.getUserDocument().lastName;
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
              let userDoc = AppComponent.getUserDocument();
              userDoc = <UserDocument>result.data();
              this.userHasProfile = result.exists;
              userDoc.userId = this.auth.getAuth().currentUser?.uid ?? "";
              
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
