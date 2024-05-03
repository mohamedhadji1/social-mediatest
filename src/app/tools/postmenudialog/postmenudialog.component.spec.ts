import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmenudialogComponent } from './postmenudialog.component';

describe('PostmenudialogComponent', () => {
  let component: PostmenudialogComponent;
  let fixture: ComponentFixture<PostmenudialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostmenudialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostmenudialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
