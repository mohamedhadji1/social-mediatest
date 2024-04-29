import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { PostService } from 'src/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postData: PostData = {} as PostData;
  creatorName: string = '';
  creatorDescription: string = '';
  posts: any[] = [];
  firestore = new FirebaseTSFirestore();

  constructor(private dialog: MatDialog, private postService: PostService) {}

  ngOnInit(): void {
    this.getCreatorInfo();
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData.postId });
  }

  getCreatorInfo() {
    this.firestore.getDocument({
      path: ["Users", this.postData.creatorId],
      onComplete: result => {
        if (result && result.data()) {
          let userDocument = result.data();
          if (userDocument) {
            this.creatorName = userDocument['publicName'];
            this.creatorDescription = userDocument['description'];
          }
        }
      }
    });
  }

  likePost(postId: string): void {
    console.log('Like clicked for post ID:', postId);

    // Simulate the like functionality
    this.postService.likePost(postId)
      .then(() => {
        console.log('Post liked successfully:', postId);
        // Increment the like count
        this.postData.likes = (this.postData.likes || 0) + 1;
      })
      .catch((error) => {
        console.error('Error liking post:', error);
        // Handle error
      });
}

  unlikePost(postId: string): void {
    console.log('Unlike clicked for post ID:', postId);

    // Simulate the unlike functionality
    this.postService.unlikePost(postId)
      .then(() => {
        console.log('Post unliked successfully:', postId);
        // Decrement the like count
        this.postData.likes = (this.postData.likes || 0) - 1;
      })
      .catch((error) => {
        console.error('Error unliking post:', error);
        // Handle error
      });
  }

  getLikesCount(likes: any): number {
    return typeof likes === 'number' ? likes : 0;
  }
}
