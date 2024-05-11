import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AddRequestService } from 'src/services/add-request.service';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-show-accepted-requests',
  templateUrl: './show-accepted-requests.component.html',
  styleUrls: ['./show-accepted-requests.component.css']
})
export class ShowAcceptedRequestsComponent implements OnInit {
  acceptedRequests: Observable<any[]> | undefined;
  loading = true;
  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  });
  filteredRequests: Observable<any[]> = new Observable<any[]>();

  constructor(private addRequestService: AddRequestService) { }

  ngOnInit() {
    this.acceptedRequests = this.addRequestService.getAcceptedRequestsByChef();
    this.initializeForm();
    this.setupFilteredRequests();
  }

  initializeForm() {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('')
    });
  }

  setupFilteredRequests() {
    this.filteredRequests = this.searchForm.get('searchTerm')!.valueChanges
      .pipe(
        startWith(''),
        switchMap((text: string) => this.search(text))
      );
  }

  search(text: string): Observable<any[]> {
    return this.acceptedRequests ? this.acceptedRequests.pipe(
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

  acceptRequest(requestId: string) {
    this.addRequestService.updateRequestStatus(requestId, { isSubmittedByrespo: true })
      .then(() => {
        alert('La demande a été acceptée.');
      })
      .catch(error => {
        console.error('Error accepting request:', error);
        alert('Erreur lors de l\'acceptation de la demande.');
      });
  }

  declineRequest(requestId: string) {
    this.addRequestService.updateRequestStatus(requestId, { isSubmittedByrespo: false })
      .then(() => {
        alert('La demande a été refusée.');
      })
      .catch(error => {
        console.error('Error declining request:', error);
        alert('Erreur lors du refus de la demande.');
      });
  }
}
