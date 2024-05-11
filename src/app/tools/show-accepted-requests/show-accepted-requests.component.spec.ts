import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAcceptedRequestsComponent } from './show-accepted-requests.component';

describe('ShowAcceptedRequestsComponent', () => {
  let component: ShowAcceptedRequestsComponent;
  let fixture: ComponentFixture<ShowAcceptedRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAcceptedRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAcceptedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
