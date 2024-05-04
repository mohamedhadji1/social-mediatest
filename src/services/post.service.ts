  import { Injectable } from '@angular/core';
  import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
  import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
  import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
  import { PostData } from 'src/app/pages/post-feed/post-feed.component';

  @Injectable({
    providedIn: 'root'
  })
  export class PostService {

    constructor(
      private firestore: FirebaseTSFirestore,
      private firebaseAuth: FirebaseTSAuth
    ) { }

    async likePost(postId: string): Promise<void> {
      const userId = this.firebaseAuth.getAuth().currentUser?.uid;
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const likeRef = [`Posts`, postId, `likes`, userId];

      try {
        const likeSnapshot = await this.firestore.getDocument({ path: likeRef });
        if (!likeSnapshot.exists) {
          await this.firestore.create({
            path: likeRef,
            data: {
              likedAt: FirebaseTSApp.getFirestoreTimestamp()
            }
          });
        }
      } catch (error) {
        console.error('Error liking post:', error);
        throw error;
      }
    }

    async unlikePost(postId: string): Promise<void> {
      const userId = this.firebaseAuth.getAuth().currentUser?.uid;
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const likeRef = [`Posts`, postId, `likes`, userId];

      try {
        const likeSnapshot = await this.firestore.getDocument({ path: likeRef });
        if (likeSnapshot.exists) {
          await this.firestore.delete({ path: likeRef });
        }
      } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
      }
    }
    async deletePost(postId: string): Promise<void> {
      try {
        await this.firestore.delete({ path: ['Posts', postId] });
      } catch (error) {
        throw new Error('Error deleting post: ');
      }
    }

    async updatePost(post: PostData): Promise<void> {
      try {
        await this.firestore.update({
          path: ['Posts', post.postId],
          data: post
        });
      } catch (error) {
        console.error('Error updating post:', error);
        throw error;
      }
    }
    async deleteComment(postId: string, commentId: string): Promise<void> {
      try {
        console.log('Deleting comment:', postId, commentId);
        await this.firestore.delete({ path: ['Posts', postId, 'PostComments', commentId] });
        console.log('Comment deleted successfully.');
      } catch (error) {
        console.error('Error deleting comment:', error);
        throw new Error('Error deleting comment: ' + error);
      }
    }
    async createPost(post: PostData): Promise<void> {
      try {
        console.log('Creating post:', post);
        await this.firestore.create({
          path: ['Posts'],
          data: post
        });
        console.log('Post created successfully.');
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
    }

  }
