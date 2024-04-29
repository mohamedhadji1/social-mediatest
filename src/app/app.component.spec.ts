import { TestBed } from '@angular/core/testing';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  FirebaseTSApp.init(environment.firebaseConfig);
  let auth = new FirebaseTSAuth();


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: MatBottomSheet, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("Should return 1 if gotten user profile", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    await auth.signInWith({
      email: "visejuani@gmail.com",
      password: "qweqwe"
    });
    var result = await app.getUserProfile();
    expect(result).toEqual(1);
  });


});
