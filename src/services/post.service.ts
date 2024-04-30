import { Injectable } from '@angular/core';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

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
}
