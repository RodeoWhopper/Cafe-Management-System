import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../components/signup/signup.component";
import {ForgotPasswordComponent} from "../components/forgot-password/forgot-password.component";
import {LoginComponent} from "../components/login/login.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:MatDialog) {
  }

  openSignupDialog(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px"
    return this.dialog.open(SignupComponent,dialogConfig);
  }

  openForgotPasswordDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px"
    return this.dialog.open(ForgotPasswordComponent,dialogConfig);
  }

  openLoginDialog(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px"
    return this.dialog.open(LoginComponent,dialogConfig);
  }

}
