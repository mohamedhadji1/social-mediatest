import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../AddProject/AddProject.component';
import { ProjectService } from 'src/services/Project.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit {
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private projectService: ProjectService
  ) {
    this.updateForm = this.fb.group({
      title: [data.title, Validators.required],
      description: [data.description, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onUpdate(): void {
    if (this.updateForm.valid) {
      this.projectService.updateProject(this.data.projectId, this.updateForm.value)
        .then(() => {
          this.dialogRef.close('update');
        })
        .catch(error => {
          console.error('Error updating project:', error);
        });
    }
  }
}
