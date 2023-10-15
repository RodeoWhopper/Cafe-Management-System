import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {SnackbarService} from "../../services/snackbar.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../../shared/global-constants";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm: any = FormGroup; //Form Group reference stored
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,//Form Builder that allows build some form groups
              private userService:UserService,//My custom User Service
              private snackbarService:SnackbarService,//My custom Snackbar Service
              private dialogRef:MatDialogRef<ForgotPasswordComponent>,//Dialog management object
              private ngxService: NgxUiLoaderService,//Loading symbol management object
  ) {
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]//There is only 1 input field, it should be filled and fit in to email regex rules
    })
  }

  handleSubmit(){
    this.ngxService.start();//Starts loading symbol
    const formData = this.forgotPasswordForm.value;//Data from forgot password form

    //To the JSON Object
    let data = {
      email: formData.email
    }
    //Sends Https request and listens for response
    this.userService.forgotPassword(data).subscribe((response:any) => {
      //On any response
      this.ngxService.stop();//Stops loading symbol
      this.responseMessage = response?.message;//If response message exists it store on class variable responseMessage
      this.dialogRef.close();//Closes dialog
      this.snackbarService.openSnackBar(this.responseMessage,(""));//Pops up a snackbar for information

    },(error) => {
      //On any error
      this.ngxService.stop();//Stops loading symbol
      if(error.error?.message){//If there is custom message in error
        this.responseMessage = error.error?.message;//It sets as the class variable responseMessage
      } else {
        this.responseMessage = GlobalConstants.genericError;//It sets GlobalConstant error message as the class variable responseMessage
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);//Pops up a snackbar with error message
    })
  }



}
