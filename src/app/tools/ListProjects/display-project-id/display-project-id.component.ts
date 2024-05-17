import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Project } from '../AddProject/AddProject.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/services/Project.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-display-project-id',
  templateUrl: './display-project-id.component.html',
  styleUrls: ['./display-project-id.component.css']
})
export class DisplayProjectIDComponent implements OnInit{
  project: Project | undefined;
  pdfSrc: SafeResourceUrl | undefined;
  pdfUrl: string | undefined;
  activeProject: any;
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private httpClient: HttpClient
  ) {}
  setActiveProject(project: Project): void {
    if (this.activeProject && this.activeProject.projectId === project.projectId) {
      this.activeProject = null;
    } else {
      this.activeProject = project;
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['projectId'];
      console.log('Project ID:', projectId);
      if (projectId) {
        this.loadProjectById(projectId);
      } else {
        console.error('Project ID is undefined');
      }
    });
  }

  loadProjectById(projectId: string): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        console.log(project);
        this.project = project;
      },
      error: (err) => {
        console.error('Error fetching project:', err);
      }
    });
  }

  loadPdf() {
    console.log('Loading PDF...');
    if (this.pdfUrl) {
        this.httpClient.get(this.pdfUrl, { responseType: 'blob' }).subscribe(
            (data) => {
                console.log('PDF loaded successfully');
                this.displayPdf(data);
            },
            (error) => {
                console.error('Error loading PDF:', error);
            }
        );
    } else {
        console.error('PDF URL is undefined');
    }
  }

  displayPdf(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    this.pdfSrc = this.getSafeUrl(url);
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
