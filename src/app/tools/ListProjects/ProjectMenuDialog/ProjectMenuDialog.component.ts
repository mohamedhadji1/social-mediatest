import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/tools/ListProjects/AddProject/AddProject.component';
import { ProjectService } from 'src/services/Project.service';
import { ConfirmationDialogComponent } from 'src/app/tools/confirmation-dialog/confirmation-dialog.component';
import { UpdateProjectComponent } from '../update-project/update-project.component';

@Component({
  selector: 'app-ProjectMenuDialog',
  templateUrl: './ProjectMenuDialog.component.html',
  styleUrls: ['./ProjectMenuDialog.component.css']

})
export class ProjectMenuDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<ProjectMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private projectService: ProjectService
  ) {}

  onClose(action: 'delete' | 'update'): void {
    this.dialogRef.close(action);
  }

  onDeleteProject(projectId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.projectService.deleteProject(projectId)
          .then(() => {
            this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
            this.dialogRef.close('delete');
            location.reload();
          })
          .catch(error => {
            console.error('Error deleting project:', error);
            this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
          });
      }
    });
  }

  onUpdateProject(project: Project): void {
    const dialogRef = this.dialog.open(UpdateProjectComponent, {
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close('update');
      }
    });
  }

}
