import { Component, OnInit } from '@angular/core';
import { AddRequestService } from 'src/services//add-request.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserDocument } from 'src/app/app.component';

@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.component.html',
  styleUrls: ['./show-request.component.css']
})
export class ShowRequestComponent implements OnInit {
  loadedUser: UserDocument | undefined;
  requests!: Observable<any[]>;
  loading = true;
  constructor(private addRequestService: AddRequestService, private router: Router) { }

  ngOnInit() {
    this.requests = this.addRequestService.getRequests();
    this.requests.subscribe(() => {
      this.loading = false; // Set loading to false when data is loaded
    });
  }
  navigateToAddRequest() {
    this.router.navigate(['/addRequest']);
  }

}
