import { Component, OnInit } from '@angular/core';
import { UserDocument } from 'src/app/app.component';
import { UserServiceService } from 'src/services/UserService.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-show-Allusers',
  templateUrl: './show-Allusers.component.html',
  styleUrls: ['./show-Allusers.component.css']
})
export class ShowAllusersComponent implements OnInit {
  users: UserDocument[] = [];
  constructor(private userService: UserServiceService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    console.log('All list',this.userService.getUsers())
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      
    });
  }

  deleteUser(user: UserDocument): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
    );

    if (confirmed) {
      this.userService.deleteUser(user.userId).then(() => {
        console.log('User deleted successfully.');
      }).catch((error) => {
        console.error('Error deleting user:', error);
      });
    }
  }

  modifyUser(user: UserDocument): void {
    const dialogRef = this.matDialog.open(EditUserDialogComponent, {
      width: '500px',
      data: user, // Pass the user data to the dialog
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        // If there were changes, update the user
        this.userService.updateUser({ ...user, ...updatedUser }).then(() => {
          console.log('User updated successfully');
        }).catch((error) => {
          console.error('Error updating user:', error);
        });
      }
    });
  }

}
