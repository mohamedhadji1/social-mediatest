import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './pages/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { ProfileComponent } from './tools/profile/profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { CreatePostComponent } from './tools/create-post/create-post.component';
import { PostComponent } from './tools/post/post.component';
import { ReplyComponent } from './tools/reply/reply.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { PostmenudialogComponent } from './tools/postmenudialog/postmenudialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from './tools/confirmation-dialog/confirmation-dialog.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdatePostDialogComponent } from './tools/update-post-dialog/update-post-dialog.component';
import { UserProfileComponent } from './tools/user-profile/user-profile.component';
import { AddRequestComponent } from './tools/add-request/add-request.component';
import { ShowRequestComponent } from './tools/show-request/show-request.component';
import { ShowAllusersComponent } from './tools/show-Allusers/show-Allusers.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditUserDialogComponent } from './tools/edit-user-dialog/edit-user-dialog.component';
import { ShowAcceptedRequestsComponent } from './tools/show-accepted-requests/show-accepted-requests.component';
import { HistoriqueUserComponent } from './tools/historique-user/historique-user.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { ListProjectsComponent } from './tools/ListProjects/ListProjects.component';
import { AddProjectComponent } from './tools/ListProjects/AddProject/AddProject.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateProjectComponent } from './tools/ListProjects/update-project/update-project.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { ProjetPublicComponent } from './tools/ListProjects/projet-public/projet-public.component';
import { DisplayProjectIDComponent } from './tools/ListProjects/display-project-id/display-project-id.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProfileChercheurComponent } from './profile-chercheur/profile-chercheur.component';
import { ProfileProjeComponent } from './profile-proje/profile-proje.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatorComponent,
    EmailVerificationComponent,
    ProfileComponent,
    PostFeedComponent,
    CreatePostComponent,
    PostComponent,
    ReplyComponent,
    PostmenudialogComponent,
    ConfirmationDialogComponent,
    SidebarComponent,
    UpdatePostDialogComponent,
    UserProfileComponent,
    AddRequestComponent,
    ShowRequestComponent,
    ShowAllusersComponent,
    EditUserDialogComponent,
    ShowAcceptedRequestsComponent,
    HistoriqueUserComponent,
    AddProjectComponent,
    ListProjectsComponent,
    PostmenudialogComponent,
    UpdateProjectComponent,
    SafeUrlPipe,
    ProjetPublicComponent,
    DisplayProjectIDComponent,
    NavBarComponent,
    ProfileChercheurComponent,
    ProfileProjeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    HttpClientModule,
    
  ],
  providers: [
    FirebaseTSFirestore,
    FirebaseTSAuth

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    FirebaseTSApp.init(environment.firebaseConfig);
  }
}
