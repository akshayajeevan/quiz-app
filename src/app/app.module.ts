import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatBottomSheet, MatBottomSheetContainer } from '@angular/material/bottom-sheet';
// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { QuizComponent } from './quiz/quiz.component';
import { SourcesComponent } from './sources/sources.component';
import { AnimateNumerComponent } from './animate-number/animate-number.component';
import { TweetSheetComponent } from './tweet-sheet/tweet-sheet.component';
// Services
import { DataService } from './shared/data.service';
import { HomeService } from './home/home.service';

import { CustomHttpInterceptor } from './shared/custom-http.interceptor';
import { CountryFilterPipe } from './shared/pipes/country-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    AboutMeComponent,
    QuizComponent,
    SourcesComponent,
    AnimateNumerComponent,
    TweetSheetComponent,
    CountryFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    MatBottomSheet,
    DataService,
    HomeService,
    DatePipe,
    DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [MatBottomSheetContainer, TweetSheetComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AppModule { }
