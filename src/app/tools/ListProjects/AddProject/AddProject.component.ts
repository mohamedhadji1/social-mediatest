import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { UserServiceService } from 'src/services/UserService.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

interface User {
  email: string;
}

export interface Project {
  title: string;
  description: string;
  isPublic: boolean;
  authors: string[];
  pdfUrl?: string;
  pdfFileName?: string;
  date: Date;
  postedBy: string; // Added property for current user ID // Added property for selected author ID
}

@Component({
  selector: 'app-AddProject',
  templateUrl: './AddProject.component.html',
  styleUrls: ['./AddProject.component.css']
})
export class AddProjectComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  project: Project = {
    title: '',
    description: '',
    isPublic: false,
    authors: [],
    date: new Date(),
    postedBy: '', // Initialize with empty string
  };
  allAuthors: string[] = ['author1@example.com']; // Example authors
  selectedAuthors: string[] = [];
  searchText: string = '';
  searchText$: Subject<string> = new Subject<string>();
  filteredAuthors: string[] = [];
  selectedFile: File | null = null;
  currentUserId: string | null = null;
  private auth = new FirebaseTSAuth();
  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.allAuthors = users.map(user => user.email); // Assuming currentUser has an 'id' field
      },
      error: (error: any) => console.error('Error fetching current user:', error)
    });
    this.filteredAuthors = this.allAuthors;


    this.searchText$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.filteredAuthors = this.allAuthors.filter(author =>
        author.toLowerCase().includes(searchText.toLowerCase()));
    });
    this.auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in:", user.uid, user.email);
        this.currentUserId = user.uid;
        this.fetchUserEmails();
      } else {
        console.error("No user is currently authenticated.");
        this.currentUserId = 'defaultUserId';
      }
    });
  }
  constructor(private userService: UserServiceService) {}

  addAuthor(author: string) {
    if (!this.selectedAuthors.includes(author)) {
      this.selectedAuthors.push(author);
    }
    this.searchText = ''; // Clear search text
    this.filteredAuthors = []; // Clear filtered authors
  }

  removeAuthor(email: string) {
    this.project.authors = this.project.authors.filter(author => author !== email);
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files ? target.files[0] : null;
  }

  submitProject() {
    if (this.currentUserId) {
      this.project.postedBy = this.currentUserId;
      // Directly use selectedAuthors, ensuring only manually selected authors are added
      this.project.authors = [...this.selectedAuthors];

      if (this.selectedFile) {
        const storage = new FirebaseTSStorage();
        const uploadPath = `projectFiles/${this.selectedFile.name}`;
        storage.upload({
          uploadName: "uploadProjectFile",
          path: [uploadPath],
          data: {
            data: this.selectedFile,
            metadata: {
              contentType: this.selectedFile.type,
            }
          },
          onComplete: (downloadUrl: string) => {
            this.project.pdfUrl = downloadUrl;
            this.project.pdfFileName = this.selectedFile?.name;
            this.createProjectDocument();
          },
          onFail: (error: any) => {
            console.error("Failed to upload file:", error);
          }
        });
      } else {
        this.createProjectDocument();
      }
    } else {
      console.error("No user ID available for submitting the project.");
    }
  }

  createProjectDocument() {
    this.firestore.create({
      path: ["projects"],
      data: this.project,
      onComplete: (docId) => {
        console.log("Project created with ID:", docId);
      },
      onFail: (err) => {
        console.error("Failed to create project:", err);
      }
    });
  }
  onSearchChange() {
    this.filteredAuthors = this.allAuthors.filter(author => author.toLowerCase().includes(this.searchText.toLowerCase()));
  }
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText$.next(input.value);
  }
  fetchUserEmails() {
    this.userService.getUsersEmails().subscribe({
      next: (emails: string[]) => {
        this.allAuthors = emails;
        this.filteredAuthors = emails;
        console.log('All Authors Loaded:', this.allAuthors);
      },
      error: (error) => console.error('Error fetching emails:', error)
    });
  }
}

