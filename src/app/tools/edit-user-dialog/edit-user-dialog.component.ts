import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDocument } from 'src/app/app.component';


@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {

  editUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDocument, // Data from the parent component
    private formBuilder: FormBuilder
  ) {
    this.editUserForm = this.formBuilder.group({
      firstName: [data.firstName, Validators.required], // Pre-filled with user data
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      phone: [data.phone],
      lab: [data.lab],
      specialization: [data.specialization],
      university: [data.university],
      role: [data.role, Validators.required], // Dropdown with specific options
    });
  }

  ngOnInit(): void {}

  saveChanges(): void {
    if (this.editUserForm.valid) {
      this.dialogRef.close(this.editUserForm.value); // Return the updated data on close
    }
  }

  cancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

}
