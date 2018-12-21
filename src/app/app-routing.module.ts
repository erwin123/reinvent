import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './com/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthguardService } from './services/authguard.service';
import { LandingComponent } from './com/landing/landing.component';
import { ArticleFeedComponent } from './com/article-feed/article-feed.component';
import { UserProfileComponent } from './com/user-profile/user-profile.component';
import { SettingComponent } from './com/setting/setting.component';
import { WriteComponent } from './com/write/write.component';
import { ArticleReadComponent } from './com/article-read/article-read.component';


const appRoutes: Routes = [

  {
    path: 'main', component: MainComponent,
    children: [
      { path: 'landing', component: LandingComponent, data: { state: 'landing' } },
      { path: 'article-read', component: ArticleReadComponent, data: { state: 'article-read' } },
      { path: 'article-feed', component: ArticleFeedComponent, data: { state: 'article-feed' } },
      { path: 'login', component: LoginComponent, data: { state: 'login' } },
      { path: 'profile', component: UserProfileComponent, data: { state: 'profile' } },
      { path: 'setting', component: SettingComponent,canActivate: [AuthguardService], data: { state: 'setting' } },
      { path: 'write', component: WriteComponent, data: { state: 'write' } }
    ]
  },
  //{ path: '', redirectTo: 'main/landing'},

  // otherwise redirect to home
  { path: '**', redirectTo: 'main/article-feed' }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled', useHash: true, })],
  exports: [RouterModule]
})
export class AppRoutingModule { }