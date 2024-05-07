import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { HomeComponent } from './pages/home/home.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { UserProfileComponent } from './tools/user-profile/user-profile.component';
import { AddRequestComponent } from './tools/add-request/add-request.component';
import { ShowRequestComponent } from './tools/show-request/show-request.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "emailVerification", component: EmailVerificationComponent},
  //{ path: 'gestion-chercheur', component: GestionChercheurComponent },
  //{ path: 'gestion-projets', component: GestionProjetsComponent },
  { path: 'profil', component: UserProfileComponent },
  { path: 'postfeed', component: PostFeedComponent },
  { path: 'addRequest', component: AddRequestComponent },
  { path: 'showRequest', component: ShowRequestComponent },
  {path: "**", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
