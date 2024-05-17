import { Component } from '@angular/core';
import { ProjectService } from 'src/services/Project.service'; // Import ProjectService
import { Project } from 'src/app/tools/ListProjects/AddProject/AddProject.component'; // Import Project model

@Component({
  selector: 'app-projet-public',
  templateUrl: './projet-public.component.html',
  styleUrls: ['./projet-public.component.css']
})
export class ProjetPublicComponent {
  projects: Project[] = []; // Define projects array to store public projects

  constructor(private projectService: ProjectService) {
    this.loadProjects();
  } // Constructor to inject ProjectService

  loadProjects(): void {
    this.projectService.getPublicProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
      error: (err: any) => console.error('Error loading public projects:', err) // Log error with context
    });
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
