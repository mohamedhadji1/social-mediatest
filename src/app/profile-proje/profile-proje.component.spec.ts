import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProjeComponent } from './profile-proje.component';

describe('ProfileProjeComponent', () => {
  let component: ProfileProjeComponent;
  let fixture: ComponentFixture<ProfileProjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileProjeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileProjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
