import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProjectIDComponent } from './display-project-id.component';

describe('DisplayProjectIDComponent', () => {
  let component: DisplayProjectIDComponent;
  let fixture: ComponentFixture<DisplayProjectIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayProjectIDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProjectIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
