import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Observable, Subject } from 'rxjs';
import { Project } from 'src/app/tools/ListProjects/AddProject/AddProject.component';
import { UserDocument } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private firestore = new FirebaseTSFirestore();
  private projectsSubject = new Subject<Project[]>();
  private auth = new FirebaseTSAuth();

  constructor(private firebaseAuth: FirebaseTSAuth) {
    this.loadProjects();

  }

  private loadProjects(): void {

    this.firestore.getCollection({
      path: ['Projects'],
      where: [],
      onComplete: (result: any) => {
        const projects = result.docs.map((doc: any) => ({
          projectId: doc.id,
          ...doc.data()
        })) as Project[];
        this.projectsSubject.next(projects);
      },
      onFail: (error: any) => {
        console.error('Error loading projects:', error);
        this.projectsSubject.next([]);
      }
    });
  }
  getCurrentUserId(): string | null {
    return this.auth.getAuth().currentUser?.uid || null;
  }
  getProjectsByUserId(userId: string ): Observable<Project[]> {
    return new Observable<Project[]>(observer => {
      this.firestore.getCollection({
        path: ['projects'],  // Make sure this matches exactly with your Firestore collection name
        where: [new Where('postedBy', '==', userId), new Where('isPublic', '==', false)],
        onComplete: (result: any) => {
          const projects = result.docs.map((doc: any) => ({
            projectId: doc.id,
            ...doc.data()
          })) as Project[];
          console.log(userId)
          console.log('Projects loaded:', projects); // Added console log to display projects
          observer.next(projects);
          observer.complete();
        },
        onFail: (error: any) => {
          console.error('Error loading projects for user:', error);
          observer.error(error);
        }
      });
    });
  }
  deleteProject(projectId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.delete({
        path: ["projects", projectId],
        onComplete: () => {
          console.log(`Project with ID ${projectId} deleted successfully.`);
          resolve();
        },
        onFail: (error) => {
          console.error(`Error deleting project with ID ${projectId}:`, error);
          reject(error);
        }
      });
    });
  }
  updateProject(projectId: string, data: Partial<Project>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.update({
        path: ["projects", projectId],
        data: data,
        onComplete: () => {
          console.log(`Project with ID ${projectId} updated successfully.`);
          resolve();
        },
        onFail: (error) => {
          console.error(`Error updating project with ID ${projectId}:`, error);
          reject(error);
        }
      });
    });
  }
  getAuthorsByProjectId(projectId: string): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.firestore.getDocument({
        path: ["projects", projectId],
        onComplete: (result) => {
          const projectData = result.data();
          const authors = projectData ? projectData['authors'] : [];
          observer.next(authors);
          observer.complete();
        },
        onFail: (error) => {
          console.error(`Error fetching authors for project with ID ${projectId}:`, error);
          observer.error(error);
        }
      });
    });
  }
  getPublicProjects(): Observable<Project[]> {
    return new Observable<Project[]>(observer => {
      this.firestore.getCollection({
        path: ['projects'],
        where: [new Where('isPublic', '==', true)],
        onComplete: (projects) => {
          const projectData = projects.docs.map(doc => ({ ...doc.data(), projectId: doc.id }) as Project);
          const userFetches = projectData.map(project =>
            this.firestore.getDocument({
              path: ["Users", project.postedBy], // Assuming 'users' is your user collection
              onComplete: (userDoc) => {
                const userData = userDoc.data() as UserDocument; // Cast to UserDocument
                console.log('Fetched user data:', userData); // Debugging line to check fetched data
                project.userDetails = userData;
              },
              onFail: (error) => console.error(`Failed to fetch user details for userId ${project.postedBy}:`, error)
            })
          );
          Promise.all(userFetches).then(() => {
            observer.next(projectData);
            observer.complete();
          });
        },
        onFail: (error) => {
          console.error('Error loading public projects:', error);
          observer.error(error);
        }
      });
    });
  }
  getProjectById(projectId: string): Observable<Project> {
    console.log("Fetching project with ID:", projectId); // Add this line to log the project ID
    return new Observable<Project>(observer => {
      this.firestore.getDocument({
        path: ["projects", projectId],
        onComplete: (doc) => {
          if (doc.exists) {
            const project = { projectId: doc.id, ...doc.data() } as Project;
            observer.next(project);
            observer.complete();
          } else {
            observer.error(new Error('Project not found'));
          }
        },
        onFail: (error) => observer.error(error)
      });
    });
  }
}
