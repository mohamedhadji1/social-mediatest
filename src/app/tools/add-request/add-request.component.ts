import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddRequestService } from 'src/services/add-request.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'; // Update with your actual path

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
    private dialog: MatDialog,
    private firebaseAuth: FirebaseTSAuth 
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
      nombreParticipants: [0, [Validators.required, Validators.min(1)]],
      lieu: ['', Validators.required],
      description: ['', Validators.required],
      isSubmittedByChef: [false],
      isSubmittedByrespo: [false],
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
          // Get the current user's ID
          const userId = this.firebaseAuth.getAuth().currentUser?.uid;

          if (userId) {
            // Add userID to the request data
            const requestData = {
              ...this.AddRequest.value,
              userId: userId,
            };

            // Submit the request with userID included
            this.addRequestService
              .addRequest(requestData)
              .then(() => {
                console.log('Request submitted');
                this.AddRequest.reset();
              })
              .catch((error) => {
                console.error('Error submitting request:', error);
              });

            console.log('Demande ajoutée:', requestData);
            this.onReset();
          } else {
            console.error('User ID not found');
          }
        }
      });
    }
  }
}
