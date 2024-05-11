import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AddRequestService } from 'src/services/add-request.service';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-show-accepted-requests',
  templateUrl: './show-accepted-requests.component.html',
  styleUrls: ['./show-accepted-requests.component.css']
})
export class ShowAcceptedRequestsComponent implements OnInit{
  acceptedRequests: Observable<any[]> | undefined;
  loading = true;
  constructor(private addRequestService: AddRequestService) { }

  ngOnInit() {
    this.acceptedRequests = this.addRequestService.getAcceptedRequestsByChef()
  }
  acceptRequest(requestId: string) {
    this.addRequestService.updateRequestStatus(requestId, { isSubmittedByrespo: true })
      .then(() => {
        alert('La demande a été acceptée.'); // Using alert to show confirmation
      })
      .catch(error => {
        console.error('Error accepting request:', error);
        alert('Erreur lors de l\'acceptation de la demande.'); // Alerting on error
      });
  }

  declineRequest(requestId: string) {
    this.addRequestService.updateRequestStatus(requestId, { isSubmittedByrespo: false })
      .then(() => {
        alert('La demande a été refusée.'); // Using alert to show confirmation
      })
      .catch(error => {
        console.error('Error declining request:', error);
        alert('Erreur lors du refus de la demande.'); // Alerting on error
      });
  }
}
