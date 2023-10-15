import {Component, OnInit} from '@angular/core';
import {DialogService} from "../../services/dialog.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  constructor(private dialogService:DialogService,
              private router:Router,
              private userService:UserService) {
  }

  signupAction(){
    this.dialogService.openSignupDialog();
  }

  forgotPasswordAction(){
    this.dialogService.openForgotPasswordDialog();
  }

  loginAction(){
    this.dialogService.openLoginDialog();
  }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null){
      this.userService.checkToken().subscribe((response:any) => {
        this.router.navigate(['/cafe/dashboard']);
      },(error:any) => {
        console.log(error);
      })
    }
  }



}
