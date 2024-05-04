import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: File | null = null;
  pdfFileName: string = ''; // Assign default value for pdfFileName
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();
  data: { post: PostData; isUpdate: boolean };
  constructor(private dialog: MatDialogRef<CreatePostComponent>,@Inject(MAT_DIALOG_DATA) data: { post: PostData; isUpdate: boolean }) {
    this.selectedImageFile = null;
    this.data = data;
  }

  ngOnInit(): void {}

  onPostClick(commentInput: HTMLTextAreaElement) {
    let comment = commentInput.value;
    if (comment.length <= 0) return;
    if (this.selectedImageFile) {
      this.uploadImagePost(comment);
    } else {
      this.uploadPost(comment);
    }
  }

  uploadImagePost(comment: string) {
    let postId = this.firestore.genDocId();
    this.storage.upload({
      uploadName: 'upload Image Post',
      path: ['Posts', postId, 'image'],
      data: {
        data: this.selectedImageFile,
      },
      onComplete: (downloadUrl) => {
        this.firestore.create({
          path: ['Posts', postId],
          data: {
            comment: comment,
            creatorId: this.auth.getAuth().currentUser?.uid,
            imageUrl: downloadUrl,
            pdfName: this.pdfFileName, // Use pdfFileName property here
            timestamp: FirebaseTSApp.getFirestoreTimestamp(),
          },
          onComplete: (docId) => {
            this.dialog.close();
          },
        });
      },
    });
  }

  uploadPost(comment: string) {
    // Create a new post data object with the updated PDF name
    const updatedPostData: PostData = {
      ...this.data.post,
      comment: comment,
      pdfName: this.pdfFileName,
    };
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
    if (photoSelector.files && photoSelector.files.length > 0) {
      this.selectedImageFile = photoSelector.files[0];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);

      fileReader.addEventListener('loadend', (ev) => {
        if (fileReader.result) {
          let readableString = fileReader.result.toString();
          let postPreviewImage = document.getElementById(
            'post-preview-image'
          ) as HTMLImageElement;
          postPreviewImage.src = readableString;
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const fileSelector = event.target as HTMLInputElement;
    if (fileSelector.files && fileSelector.files.length > 0) {
      this.selectedImageFile = fileSelector.files[0];
      this.pdfFileName = this.selectedImageFile.name; // Set pdfFileName from selected file name
    }
  }
}
