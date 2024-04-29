import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore: FirebaseTSFirestore;
  comments: Comment[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private postId: string) {
    this.firestore = new FirebaseTSFirestore(); // Initialize FirebaseTSFirestore
  }

  ngOnInit(): void {
    this.getComments();
  }

  isCommentCreator(comment: Comment): boolean {
    try {
      return comment.creatorId === AppComponent.getUserDocument()?.userId ?? false;
    } catch (err) {
      console.error("Error checking if user is comment creator:", err);
      return false;
    }
  }

  getComments(): void {
    this.firestore.listenToCollection({
      name: "Post Comments",
      path: ["Posts", this.postId, "PostComments"],
      where: [new OrderBy("timestamp", "asc")],
      onUpdate: (result) => {
        result.docChanges().forEach(postCommentDoc => {
          if (postCommentDoc.type === "added") {
            this.comments.unshift(postCommentDoc.doc.data() as Comment);
          }
        });
      }
    });
  }

  onSendClick(commentInput: HTMLInputElement): void {
    if (!(commentInput.value.length > 0)) return;
    const userDocument = AppComponent.getUserDocument();
    if (!userDocument) return; // Check if user document exists
    this.firestore.create({
        path: ["Posts", this.postId, "PostComments"],
        data: {
            comment: commentInput.value,
            creatorId: userDocument.userId,
            creatorName: userDocument.publicName, // Update to publicName
            timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docId) => {
            commentInput.value = "";
        }
    });
}

}
export interface Comment {
  creatorId: string;
  creatorName: string;
  comment: string;
  timestamp: firebase.default.firestore.Timestamp;
}
