import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-ListProjects',
  templateUrl: './ListProjects.component.html',
  styleUrls: ['./ListProjects.component.css']
})
export class ListProjectsComponent implements OnInit {
  projects: any[] = [];

  constructor(private firestore: FirebaseTSFirestore) {}

  ngOnInit() {
    this.firestore.getCollection({
      path: ["Projects"],
      where: [
        {
          fieldPath: "privacy",
          opStr: "==",
          value: "public"
        }
      ],
      onComplete: (result) => {
        this.projects = result.docs.map(doc => doc.data());
      },
      onFail: err => {
        console.error("Failed to fetch public projects:", err);
      }
    });
  }

  downloadProject(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }
}
