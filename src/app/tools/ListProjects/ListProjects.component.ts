import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Project } from './AddProject/AddProject.component';
import { ProjectService } from 'src/services/Project.service';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { UserDocument } from 'src/app/app.component';  // Corrected import path
import { Timestamp } from '@firebase/firestore-types';
import { MatDialog } from '@angular/material/dialog';
import { ProjectMenuDialogComponent } from './ProjectMenuDialog/ProjectMenuDialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ListProjects',
  templateUrl: './ListProjects.component.html',
  styleUrls: ['./ListProjects.component.css']
})
export class ListProjectsComponent implements OnInit {
  projects: Project[] = [];
  currentUserId: string = '';
  private auth = new FirebaseTSAuth();
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
        console.log("User signed in:", user.uid);
        this.currentUserId = user.uid;
        this.fetchUserProfileData(user.uid);
        this.loadUserProjects();  // Move this inside the callback
      } else {
        console.error("No user is currently authenticated.");
        this.currentUserId = 'defaultUserId';  // Consider handling this case more gracefully
        this.loadUserProjects();  // Consider if you want to load projects when no user is authenticated
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
        this.projects.forEach(project => {
          this.projectService.getAuthorsByProjectId(project.projectId).subscribe(authors => {
            project.authors = authors; // Assuming 'authors' is an array of author details
          });
        });
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
}

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
