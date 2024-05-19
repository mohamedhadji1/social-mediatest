import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Project } from '../tools/ListProjects/AddProject/AddProject.component';
import { ProjectMenuDialogComponent } from '../tools/ListProjects/ProjectMenuDialog/ProjectMenuDialog.component';
import { UserDocument } from '../app.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { ProjectService } from 'src/services/Project.service';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile-proje',
  templateUrl: './profile-proje.component.html',
  styleUrls: ['./profile-proje.component.css']
})
export class ProfileProjeComponent {
  projects: Project[] = [];
  currentUserId: string = '';
  private auth = new FirebaseTSAuth();
  totalProjects: number = 0;  // Variable to store the total number of projects
  userProfileData: UserDocument | null = null;
  activeProject: Project | null = null;
  constructor(
     private firestore: FirebaseTSFirestore,
     private projectService: ProjectService,
     private dialog: MatDialog,
     private sanitizer: DomSanitizer
     ) {}
     setActiveProject(project: Project): void {
      if (this.activeProject && this.activeProject.projectId === project.projectId) {
        this.activeProject = null;  // This will "close" the PDF if the same project is clicked again
      } else {
        this.activeProject = project;
      }
    }

  ngOnInit() {
    this.auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.fetchUserProfileData(user.uid);
        this.loadUserProjects();
        this.loadTotalProjects();  // Load total projects
      } else {
        console.error("No user is currently authenticated.");
      }
    });
  }
  getAuthorsEmails(project: Project): string {
    return project.authors.map(authors => authors.email).join(', ');
  }
  fetchUserProfileData(userId: string) {
    this.firestore.getDocument({
      path: ['Users', userId],
      onComplete: (documentSnapshot) => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data() as UserDocument;
          this.userProfileData = userData;
          console.log("User Profile Data:", this.userProfileData);
        } else {
          console.log("User profile document does not exist.");
        }
      },
      onFail: (error) => {
        console.error("Failed to fetch user profile data:", error);
      }
    });
  }

  openProjectMenu(project: Project) {
    const dialogRef = this.dialog.open(ProjectMenuDialogComponent, {
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        // Handle delete action
      } else if (result === 'update') {
        // Handle update action
      }
    });
  }

  loadUserProjects(): void {
    this.projectService.getProjectsByUserId(this.currentUserId).subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;

      },
      error: (err) => console.error(err)
    });
  }

  downloadProject(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }

  convertTimestampToDate(timestamp: any): Date {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    } else if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    } else {
      throw new Error('Invalid timestamp object');
    }
  }
  loadTotalProjects(): void {
    this.projectService.getTotalProjectsByUserId(this.currentUserId).subscribe({
      next: (total: number) => {
        this.totalProjects = total;
      },
      error: (err) => console.error('Error fetching total projects:', err)
    });
  }
}

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

