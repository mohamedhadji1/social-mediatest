import { Component, OnInit } from '@angular/core';
import { UserDocument } from 'src/app/app.component';
import { UserServiceService } from 'src/services/UserService.service';

@Component({
  selector: 'app-show-Allusers',
  templateUrl: './show-Allusers.component.html',
  styleUrls: ['./show-Allusers.component.css']
})
export class ShowAllusersComponent implements OnInit {
  users: UserDocument[] = [];
  constructor(private userService: UserServiceService) { }

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

  // Modify user
  modifyUser(user: UserDocument): void {
    // Navigate to a different component or open a modal for editing
    // this.router.navigate(['/edit-user', user.userId]); // Example navigation
  }

}
