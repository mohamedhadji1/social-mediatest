import { Component, Inject, OnInit } from '@angular/core';
import {
  FirebaseTSFirestore,
  OrderBy,
} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css'],
})
export class ReplyComponent implements OnInit {
  firestore: FirebaseTSFirestore;
  comments: Comment[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private postId: string,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private postService: PostService,
    private router: Router
  ) {
    this.firestore = new FirebaseTSFirestore(); // Initialize FirebaseTSFirestore
  }

  ngOnInit(): void {
    this.getComments();
  }

  isCommentCreator(comment: Comment): boolean {
    try {
      return (
        comment.creatorId === AppComponent.getUserDocument()?.userId ?? false
      );
    } catch (err) {
      console.error('Error checking if user is comment creator:', err);
      return false;
    }
  }

  getComments(): void {
    this.firestore.listenToCollection({
      name: 'Post Comments',
      path: ['Posts', this.postId, 'PostComments'],
      where: [new OrderBy('timestamp', 'asc')],
      onUpdate: (result) => {
        result.docChanges().forEach((postCommentDoc) => {
          if (postCommentDoc.type === 'added') {
            this.comments.unshift(postCommentDoc.doc.data() as Comment);
          }
        });
      },
    });
  }

  onSendClick(commentInput: HTMLInputElement): void {
    if (!(commentInput.value.length > 0)) return;
    const userDocument = AppComponent.getUserDocument();
    if (!userDocument) return; // Check if user document exists
    this.firestore.create({
      path: ['Posts', this.postId, 'PostComments'],
      data: {
        comment: commentInput.value,
        creatorId: userDocument.userId,
        creatorName: userDocument.publicName, // Update to publicName
        timestamp: FirebaseTSApp.getFirestoreTimestamp(),
      },
      onComplete: (docId) => {
        commentInput.value = '';
      },
    });
  }
  onDeleteComment(comment: Comment): void {
    if (this.isCommentCreator(comment)) {
      this.postService.deleteComment(this.postId,comment.id)
        .then(() => {
          this.comments = this.comments.filter(c => c.id !== comment.id); // Remove the comment from the UI
          this.snackBar.open('Comment deleted successfully.', 'Close', { duration: 3000 });
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
          this.snackBar.open('Error deleting comment.', 'Close', { duration: 3000 });
        });
    } else {
      this.snackBar.open('You are not authorized to delete this comment.', 'Close', { duration: 3000 });
    }
  }
}
export interface Comment {
  id: string;
  creatorId: string;
  creatorName: string;
  comment: string;
  timestamp: firebase.default.firestore.Timestamp;
}
