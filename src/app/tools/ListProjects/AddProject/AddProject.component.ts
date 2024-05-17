import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { UserServiceService } from 'src/services/UserService.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

export interface Project {
  title: string;
  description: string;
  isPublic: boolean;
  authors: UserDocument[];
  pdfUrl?: string;
  pdfFileName?: string;
  date: any;
  postedBy: string;
  projectId: string;
  userDetails?: UserDocument;
}
export interface UserDocument {
  publicName: string;
  description: string;
  userId: string;
  imageUrl:string;
  firstName: string;
  lastName: string;
  university: string;
  email: string;
  specialization: string;
  lab: string;
  phone: string;
  role: string;
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
    postedBy: '',
    projectId: ''
  };

  allAuthors: string[] = [];
  allUsers: UserDocument[] = []; // Example authors
  selectedAuthors: UserDocument[] = [];
  searchText: string = '';
  searchText$: Subject<string> = new Subject<string>();
  filteredAuthors: string[] = [];
  selectedFile: File | null = null;
  currentUserId: string | null = null;
  private auth = new FirebaseTSAuth();
  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users: UserDocument[]) => {
        this.allUsers = users; // Assuming currentUser has an 'id' field
        this.allAuthors = users.map(user => user.email);
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

  addAuthor(email: string) {
    const user = this.allUsers.find(user => user.email === email);
    if (user && !this.selectedAuthors.some(author => author.email === email)) {
      this.selectedAuthors.push(user);
    }
  }

  removeAuthor(email: string) {
    this.selectedAuthors = this.selectedAuthors.filter(author => author.email !== email);
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files ? target.files[0] : null;
  }

  submitProject() {
    if (this.currentUserId) {
      this.project.postedBy = this.currentUserId;
      this.project.authors = this.selectedAuthors; // Directly use the selected UserDocument objects
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
    this.searchText = input.value;
    this.searchText$.next(this.searchText);
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

