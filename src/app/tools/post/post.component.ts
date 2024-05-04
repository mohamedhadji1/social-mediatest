import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { PostService } from 'src/services/post.service';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { PostmenudialogComponent } from '../postmenudialog/postmenudialog.component';
import { UserDocument } from 'src/app/app.component';

type Likes = {
  [userId: string]: number | undefined;
};

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() postData: PostData = {} as PostData;
  creatorName: string = '';
  creatorDescription: string = '';
  likesCount: number = 0;
  currentUserId: string | null = null;
  likedByCurrentUser: boolean = false; // Added to track whether the current user has liked the post
  loadedUser: UserDocument | undefined;
  likes: Likes = {};
  constructor(
    private dialog: MatDialog,
    private postService: PostService,
    private firestore: FirebaseTSFirestore
  ) {}

  ngOnInit(): void {
    this.getCreatorInfo();
    this.getLikesCount(); // Fetch initial like count
    this.currentUserId = this.getCurrentUserId();
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData.postId });
  }

  getCreatorInfo() {
    this.firestore.getDocument({
      path: ['Users', this.postData.creatorId],
      onComplete: (result) => {
        if (result && result.data()) {
          this.loadedUser = result.data() as UserDocument;
          let userDocument = result.data();
          if (userDocument) {
            this.creatorName = userDocument['publicName'];
            this.creatorDescription = userDocument['description'];
          }
        }
      },
    });
  }

  likePost(postId: string): void {
    console.log('Like clicked for post ID:', postId);

    // Check if the user already liked the post
    if (!this.currentUserId || this.likes[this.currentUserId] === 1) {
      console.log('User already liked the post');
      return;
    }

    // Simulate the like functionality
    this.postService
      .likePost(postId)
      .then(() => {
        console.log('Post liked successfully:', postId);
        // Increment the like count
        this.likes[this.currentUserId!] = 1;
        this.likesCount++;
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  }

  unlikePost(postId: string): void {
    console.log('Unlike clicked for post ID:', postId);
    if (!this.currentUserId || this.likes[this.currentUserId] !== 1) {
      console.log('User already unliked the post');
      return;
    }
    this.postService
      .unlikePost(postId)
      .then(() => {
        console.log('Post unliked successfully:', postId);
        this.likes[this.currentUserId!] = 0;
        this.likesCount--;
      })
      .catch((error) => {
        console.error('Error unliking post:', error);
      });
  }
  getCurrentUserId(): string | null {
    const userId = new FirebaseTSAuth().getAuth().currentUser?.uid;
    return userId || null;
  }
  getLikesCount(): void {
    const likeRef = [`Posts`, this.postData.postId, `likes`];
    this.firestore.getCollection({
      path: likeRef,
      where: [], // Add an empty where parameter
      onComplete: (snapshot) => {
        this.likesCount = snapshot.size;
      },
      onFail: (error) => {
        console.error('Error fetching likes:', error);
      },
    });
  }
  getFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  downloadPdf(pdfLink: HTMLAnchorElement): void {
    if (pdfLink) {
      pdfLink.click();
    }
  }
  openMenu(postData: PostData) {
    const dialogRef = this.dialog.open(PostmenudialogComponent, {
      data: postData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        // Handle delete action
      } else if (result === 'update') {
        // Handle update action
      }
    });
  }
}
