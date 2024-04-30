import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit{

  selectedImageFile: File | null = null;
  selectedFile: File | null = null;
  pdfFileName: string | null = null; // New attribute for storing the PDF file name
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();

  constructor(private dialog: MatDialogRef<CreatePostComponent>) {
    this.selectedImageFile = null;
    this.selectedFile = null;
  }

  ngOnInit(): void {
  }

  onPostClick(commentInput: HTMLTextAreaElement) {
    let comment = commentInput.value;
    if(comment.length <= 0 ) return;
    if(this.selectedImageFile) {
      this.uploadImagePost(comment);
    } else {
      this.uploadPost(comment);
    }

  }

  uploadImagePost(comment: string){
    let postId = this.firestore.genDocId();
    this.storage.upload(
      {
        uploadName: "upload Image Post",
        path: ["Posts", postId, "image"],
        data: {
          data: this.selectedImageFile
        },
        onComplete: (downloadUrl) => {
          this.firestore.create(
            {
              path: ["Posts", postId],
              data: {
                comment: comment,
                creatorId: this.auth.getAuth().currentUser?.uid,
                imageUrl: downloadUrl,
                pdfName: this.pdfFileName, // Save the PDF file name
                timestamp: FirebaseTSApp.getFirestoreTimestamp()
              },
              onComplete: () => {
                this.dialog.close();
              }
            }
          );
        }
      }
    );
  }
 uploadPost(comment: string){
    this.firestore.create(
      {
        path: ["Posts"],
        data: {
          comment: comment,
          creatorId: this.auth.getAuth().currentUser?.uid,
          pdfName: this.pdfFileName, // Save the PDF file name
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: () => {
          this.dialog.close();
        }
      }
    );
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
    if (photoSelector.files && photoSelector.files.length > 0) {
      this.selectedImageFile = photoSelector.files[0];
    }
  }

  onFileSelected(event: Event) {
    const fileSelector = event.target as HTMLInputElement;
    if (fileSelector.files && fileSelector.files.length > 0) {
      this.selectedFile = fileSelector.files[0];
      this.pdfFileName = this.selectedFile.name; // Set the PDF file name
    }
  }
}
