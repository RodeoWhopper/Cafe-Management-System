import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { FullComponent } from './components/full/full.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import { SignupComponent } from './components/signup/signup.component';
import {MatDialogModule} from "@angular/material/dialog";
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, PB_DIRECTION } from "ngx-ui-loader";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import {TokenInterceptor} from "./services/token.interceptor";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text:"Loading...",
  textColor:"#FFFFFF",
  textPosition:"center-center",
  pbColor:"red",
  bgsColor:"red",
  fgsColor:"red",
  fgsType: SPINNER.pulse,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness:5,
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FullComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        HttpClientModule,
        MatDialogModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        MatToolbarModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule
    ],
  providers: [HttpClient,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
