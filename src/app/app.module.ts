import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './com/login/login.component';
import { MainComponent } from './main/main.component';
import { LandingComponent } from './com/landing/landing.component';
import { AuthguardService } from './services/authguard.service';

//Angular Material Components
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ArticleFeedComponent } from './com/article-feed/article-feed.component';
import { UserProfileComponent } from './com/user-profile/user-profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CategoryComponent } from './com/category/category.component';
import { SettingComponent } from './com/setting/setting.component';
import { NguCarouselModule } from '@ngu/carousel';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider
} from "angular-6-social-login-v2";
import { CarouselComponent } from './com/carousel/carousel.component';
import { CommentComponent } from './com/comment/comment.component';
import { WriteComponent } from './com/write/write.component';
import { FiltermediaPipe } from './pipes/filtermedia.pipe';
import { NgxEditorModule } from 'ngx-editor';
import { SortdescPipe } from './pipes/sortdesc.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { StriphtmlPipe } from './pipes/striphtml.pipe';
import { FollowComponent } from './com/follow/follow.component';
import { ProfilePicComponent } from './com/profile-pic/profile-pic.component';
import { ArticleHeaderComponent } from './com/article-header/article-header.component';
import { ArticleReadComponent } from './com/article-read/article-read.component';
import { LoadingComponent } from './com/loading/loading.component';
import { RouterExtService } from './services/router-ext.service';
import { ScrollTrackerModule } from '@nicky-lenaers/ngx-scroll-tracker';
import { ArticleCardComponent } from './com/article-card/article-card.component';
import { ProfileCardComponent } from './com/profile-card/profile-card.component';
import { ArraySortPipePipe } from './pipes/array-sort-pipe.pipe';


export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("259049374758284") //dev
        //provider: new FacebookLoginProvider("362039564339296") //prod
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("1001880322458-ivegbevrkil3ocf520k3q7av9o2f1ojc.apps.googleusercontent.com")
        //provider: new GoogleLoginProvider("452906102008-l8akc36n7mbt9ocu5nu2lkp71obongos.apps.googleusercontent.com")
      },
      {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    LandingComponent,
    ArticleFeedComponent,
    UserProfileComponent,
    CategoryComponent,
    SettingComponent,
    CarouselComponent,
    CommentComponent,
    WriteComponent,
    FiltermediaPipe,
    SortdescPipe,
    SanitizePipe,
    StriphtmlPipe,
    FollowComponent,
    ProfilePicComponent,
    ArticleHeaderComponent,
    ArticleReadComponent,
    LoadingComponent,
    ArticleCardComponent,
    ProfileCardComponent,
    ArraySortPipePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    SocialLoginModule,
    ScrollTrackerModule.forRoot(),
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FlexLayoutModule,
    NguCarouselModule,
    NgxEditorModule
  ],
  providers: [AuthguardService,RouterExtService, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
