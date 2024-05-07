import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddRequestService } from 'src/services//add-request.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent {
  AddRequest: FormGroup;
  constructor(
    private fb: FormBuilder,
    private addRequestService: AddRequestService,
    private dialog: MatDialog
  ) {
    this.AddRequest = this.fb.group({
      nomEven: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      typeEvenement: this.fb.group({
        conference: [false],
        atelier: [false],
        seminaire: [false],
      }),
      nombreParticipants: [2, [Validators.required, Validators.min(1)]],
      lieu: ['', Validators.required],
      description: ['', Validators.required],
      action: ['En attend'],
    });
  }

  onReset() {
    this.AddRequest.reset({
      nombreParticipants: 2,
    });
  }
  onSubmit() {
    if (this.AddRequest.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { message: 'Votre demande ne peut pas être modifiée' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirm') {
          this.addRequestService
            .addRequest(this.AddRequest.value)
            .then(() => {
              console.log('Request submitted');
              this.AddRequest.reset();
            })
            .catch((error) => {
              console.error('Error submitting request:', error);
            });
          console.log('Demande ajoutée:', this.AddRequest.value);
          this.onReset();
        }
      });
    }
  }

}
