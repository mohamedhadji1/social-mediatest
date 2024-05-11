import { Component, OnInit } from '@angular/core';
import { AddRequestService } from 'src/services//add-request.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserDocument } from 'src/app/app.component';
import { UserServiceService } from 'src/services/UserService.service';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
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
  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  });
  filteredRequests: Observable<any[]> = new Observable<any[]>();
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
    this.initializeForm();
    this.setupFilteredRequests();
  }
  isChercheur(userList: UserDocument[]): boolean {
    return !!userList.find(user => user.role === 'chercheur');
  }
  initializeForm() {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('')
    });
  }
  navigateToAddRequest() {
    this.router.navigate(['/addRequest']);
  }
  setupFilteredRequests() {
    this.filteredRequests = this.searchForm.get('searchTerm')!.valueChanges
      .pipe(
        startWith(''),
        switchMap((text: string) => this.search(text))
      );
  }

  search(text: string): Observable<any[]> {
    return this.requests ? this.requests.pipe(
      map(requests => requests.filter(request => request.nomEven.toLowerCase().includes(text.toLowerCase())))
    ) : of([]);
  }

  applyFilter() {
    const searchTermControl = this.searchForm.get('searchTerm');
    if (searchTermControl) {
      const searchTerm = searchTermControl.value;
      this.filteredRequests = this.search(searchTerm);
    } else {
      console.error('Search term control not found');
    }
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
