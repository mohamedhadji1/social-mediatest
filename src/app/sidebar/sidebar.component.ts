import { UserDocument } from 'src/app/app.component';
import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() user: UserDocument = { publicName: '', description: '', userId: '', imageUrl: '' }; // Initialize the user property

  opened: boolean = false;
  loadedUser: UserDocument | undefined;

  constructor(
    private firestore: FirebaseTSFirestore,
    private auth: FirebaseTSAuth
  ) {}

  ngOnInit(): void {
    if (this.user) {
      this.getCreatorInfo(this.user.userId);
    }
  }

  getCreatorInfo(creatorId: string) {
    this.firestore.getDocument({
      path: ['Users', creatorId],
      onComplete: (result) => {
        if (result && result.data()) {
          const userData = result.data() as UserDocument;
          this.loadedUser = {
            publicName: userData.publicName,
            description: userData.description,
            userId: userData.userId,
            imageUrl: userData.imageUrl
          };
        }
      },
    });
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }
}
