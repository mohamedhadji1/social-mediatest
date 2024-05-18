import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChercheurComponent } from './profile-chercheur.component';

describe('ProfileChercheurComponent', () => {
  let component: ProfileChercheurComponent;
  let fixture: ComponentFixture<ProfileChercheurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileChercheurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileChercheurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
