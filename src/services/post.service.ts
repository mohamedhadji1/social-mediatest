import { Injectable } from '@angular/core';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: FirebaseTSFirestore, private firebaseAuth: FirebaseTSAuth) { }

  // Function to handle liking a post
  async likePost(postId: string): Promise<void> {
    const userId = this.firebaseAuth.getAuth().currentUser?.uid; // Get current user's ID
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    // Check if the user has already liked the post
    const likeRef = await this.firestore.getDocument({
      path: [`Posts`, postId, `likes`, userId]
    });

    if (!likeRef.exists) {
      // User hasn't liked the post yet, add the like
      await this.firestore.create({
        path: [`Posts`, postId, `likes`, userId],
        data: {
          likedAt: FirebaseTSApp.getFirestoreTimestamp()
        }
      });
    } else {
      throw new Error('User has already liked the post');
    }
  }

  // Function to handle unliking a post
  async unlikePost(postId: string): Promise<void> {
    const userId = this.firebaseAuth.getAuth().currentUser?.uid; // Get current user's ID
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    // Check if the user has liked the post
    const likeRef = await this.firestore.getDocument({
      path: [`Posts`, postId, `likes`, userId]
    });

    if (likeRef.exists) {
      // User has liked the post, remove the like
      await this.firestore.delete({
        path: [`Posts`, postId, `likes`, userId]
      });
    } else {
      throw new Error('User has not liked the post');
    }
  }
}
