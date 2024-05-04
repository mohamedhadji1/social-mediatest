import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { PostService } from 'src/services/post.service';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';

@Component({
  selector: 'app-update-post-dialog',
  templateUrl: './update-post-dialog.component.html',
  styleUrls: ['./update-post-dialog.component.css']
})
export class UpdatePostDialogComponent {
  selectedImageFile: File | null = null;
  selectedPdfFile: File | null = null;
  imageUrl: string | null = null;
  pdfUrl: string | null = null;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();

  constructor(
    public dialogRef: MatDialogRef<UpdatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostData,
    private snackBar: MatSnackBar,
    private postService: PostService
  ) { }

  onUpdatePost(post: PostData): void {
    if (this.selectedImageFile) {
      this.uploadImagePost(post);
    } else if (this.selectedPdfFile) {
      this.uploadPdfPost(post);
    } else {
      this.updatePostWithoutFile(post);
    }
  }

  uploadImagePost(post: PostData): void {
    const postId = post.postId;
    this.storage.upload({
      uploadName: "Update Image Post",
      path: ["Posts", postId, "image"],
      data: {
        data: this.selectedImageFile
      },
      onComplete: (downloadUrl) => {
        this.firestore.update({
          path: ["Posts", postId],
          data: {
            ...post,
            imageUrl: downloadUrl,
            imageName: this.selectedImageFile?.name
          },
          onComplete: () => {
            this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close('updated');
          }
        });
      }
    });
  }

  uploadPdfPost(post: PostData): void {
    const postId = post.postId;
    this.storage.upload({
      uploadName: "Update PDF Post",
      path: ["Posts", postId, "pdf"],
      data: {
        data: this.selectedPdfFile
      },
      onComplete: (downloadUrl) => {
        this.firestore.update({
          path: ["Posts", postId],
          data: {
            ...post,
            pdfUrl: downloadUrl,
            pdfName: this.selectedPdfFile?.name
          },
          onComplete: () => {
            this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close('updated');
          }
        });
      }
    });
  }

  updatePostWithoutFile(post: PostData): void {
    this.firestore.update({
      path: ["Posts", post.postId],
      data: post,
      onComplete: () => {
        this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close('updated');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close('canceled');
  }

  onPhotoSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.selectedImageFile = inputElement.files[0];
      this.imageUrl = URL.createObjectURL(this.selectedImageFile);

      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);

      fileReader.addEventListener(
        "loadend",
        ev => {
          if (fileReader.result) {
            let readableString = fileReader.result.toString();
            let postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement;
            postPreviewImage.src = readableString;
          }
        }
      );
    }
  }

  onPdfSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.selectedPdfFile = inputElement.files[0];
      this.pdfUrl = URL.createObjectURL(this.selectedPdfFile);
    }
  }
}
