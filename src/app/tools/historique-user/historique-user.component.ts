import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'; // Update with your actual path
import { UserServiceService } from 'src/services/UserService.service';

@Component({
  selector: 'app-historique-user',
  templateUrl: './historique-user.component.html',
  styleUrls: ['./historique-user.component.css']
})
export class HistoriqueUserComponent implements OnInit {
  userPosts: any[] = [];
  userRequests: any[] = [];
  currentUserId: string | null = null;

  constructor(
    private userService: UserServiceService,
    private firebaseAuth: FirebaseTSAuth
  ) {}

  ngOnInit(): void {
    // Get the current user's ID
    this.firebaseAuth.listenToSignInStateChanges(user => {
      if (user) {
        this.currentUserId = user.uid;
        if (this.currentUserId) {
          this.fetchUserPosts(this.currentUserId);
          this.fetchUserRequests(this.currentUserId);
        }
      } else {
        this.currentUserId = null;
        this.userPosts = [];
      }
    });
  }

  fetchUserPosts(userId: string): void {
    // Fetch user-specific posts
    this.userService.getUserPosts(userId).subscribe(posts => {
      this.userPosts = posts;
    });
  }
  fetchUserRequests(userId: string): void {
    this.userService.getUserRequests(userId).subscribe(requests => {
      this.userRequests = requests;
    });
  }

}
