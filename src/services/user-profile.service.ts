import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor() { }
  getUserProfile(): Observable<any> {
    // Simulated data for demonstration
    return of({ image: 'path/to/user/image.jpg', name: 'John Doe' });
  }
}
