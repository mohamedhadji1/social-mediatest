import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/services/post.service';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-postmenudialog',
  templateUrl: './postmenudialog.component.html',
  styleUrls: ['./postmenudialog.component.css']
})
export class PostmenudialogComponent {
  posts: PostData[] = [];

  constructor(
    public dialogRef: MatDialogRef<PostmenudialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostData,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private postService: PostService,
    private router: Router
  ) { }

  onClose(action: 'delete' | 'update'): void {
    this.dialogRef.close(action);
  }

  onDeletePost(postId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Post',
        message: 'Are you sure you want to delete this post?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.postService.deletePost(postId)
          .then(() => {
            this.snackBar.open('Post deleted successfully', 'Close', { duration: 3000 });
            this.dialogRef.close('delete');
            location.reload
          })
          .catch(error => {
            console.error('Error deleting post:', error);
            this.snackBar.open('Error deleting post', 'Close', { duration: 3000 });
          });
      }
    });
  }

  onUpdatePost(post: PostData): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      data: { post, isUpdate: true }
    });

    dialogRef.afterClosed().subscribe(updatedPost => {
      if (updatedPost) {
        this.postService.updatePost(updatedPost)
          .then(() => {
            this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
            // Update the post in the UI
            const index = this.posts.findIndex(p => p.postId === updatedPost.postId);
            if (index !== -1) {
              this.posts[index] = updatedPost;
            }
          })
          .catch(error => {
            console.error('Error updating post:', error);
            this.snackBar.open('Error updating post', 'Close', { duration: 3000 });
          });
      }
    });
  }
}
