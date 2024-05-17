import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetPublicComponent } from './projet-public.component';

describe('ProjetPublicComponent', () => {
  let component: ProjetPublicComponent;
  let fixture: ComponentFixture<ProjetPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetPublicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
