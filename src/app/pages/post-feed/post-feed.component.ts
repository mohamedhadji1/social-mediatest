import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostService } from 'src/services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostmenudialogComponent } from 'src/app/tools/postmenudialog/postmenudialog.component';
@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  currentUserId: string = '...';
  firestore = new FirebaseTSFirestore();
  posts: PostData [] = [];
  constructor(private dialog: MatDialog, private postService: PostService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getPosts();
  }

  onCreatePostClick(){
    this.dialog.open(CreatePostComponent);
  }
  
  getPosts(){
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(10)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let post = <PostData>doc.data();
              post.postId = doc.id;
              this.posts.push(post);
            }
          );
        },
        onFail: err => {

        }
      }
    );
  }
}

export interface PostData {
  comment: string;
  creatorId: string;
  imageUrl?: string;
  postId: string;
  pdfUrl: string; // Add the PDF file URL property
  pdfName: string;
}
