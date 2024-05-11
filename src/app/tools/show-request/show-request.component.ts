import { Component, OnInit } from '@angular/core';
import { AddRequestService } from 'src/services//add-request.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserDocument } from 'src/app/app.component';
import { UserServiceService } from 'src/services/UserService.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.component.html',
  styleUrls: ['./show-request.component.css']
})
export class ShowRequestComponent implements OnInit {
  loadedUser: UserDocument | undefined;
  requests!: Observable<any[]>;
  loading = true;
  isChercheur$!: Observable<boolean>;
  userRole: UserDocument | null = null;
  constructor(
    private addRequestService: AddRequestService,
    private router: Router,
    private userService: UserServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.requests = this.addRequestService.getRequests();
    this.requests.subscribe(() => {
      this.loading = false; // Set loading to false when data is loaded
      this.isChercheur$ = this.userService.getUsers().pipe(
        map((users: UserDocument[]) => users.some(user => user.role === 'chercheur'))
      );
    });
    this.requests = this.addRequestService.getRequests();
  }
  isChercheur(userList: UserDocument[]): boolean {
    return !!userList.find(user => user.role === 'chercheur');
  }
  navigateToAddRequest() {
    this.router.navigate(['/addRequest']);
  }
  // Method to accept a request
  acceptRequest(requestId: string) {
    this.addRequestService.updateRequestStatus(requestId, { isSubmittedByChef: true })
      .then(() => {
        alert('La demande a été acceptée. et a été envoyer au responsable');
      })
      .catch(error => {
        console.error('Error accepting request:', error);
      });
  }

  // Method to decline a request
  declineRequest(requestId: string) {
    this.addRequestService.updateRequestStatus(requestId, { isSubmittedByChef: false })
      .then(() => {
        alert('La demande a été refusée.');
      })
      .catch(error => {
        console.error('Error declining request:', error);
      });
  }
}
