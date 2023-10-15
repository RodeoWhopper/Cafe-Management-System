import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../../shared/global-constants";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  //FormGroup is a class that provides control on inputs and groups the form elements
  //There is lots of validation rules on Validators class for custom form group
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,//It's used for create form groups
    private router: Router,//It's used for route to another path
    private userService: UserService,//It's a custom user service that sends a JSON object to port 8080
    private snackbarService: SnackbarService,//It's service that creates a snackbar
    private dialogRef: MatDialogRef<SignupComponent>,//It's used for dialog management and its get a dialog component as generic
    private ngxService: NgxUiLoaderService//It's used for popping up a
  ) { }




  //It should be got validators when its initialized
  ngOnInit(): void {

    //These are validation rules
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]]
    });
  }


  //Submission method, it has all process about sign up
  handleSubmit(){

    //Loading symbol pops up
    this.ngxService.start();
    //Gets formData from signup form
    let formData = this.signupForm.value;
    //Creates an JSON object from formData
    let data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
    }


    this.userService.signup(data)/*Sends http post request on 8080/user/signup */
      .subscribe((response:any) => {/*Listens for response */
      this.ngxService.stop();/*On response incoming it stops the loading symbol*/
      this.dialogRef.close();/*Closes the signup dialog*/
      this.responseMessage = response?.message;/*If response object exits store it on response message*/
      this.snackbarService.openSnackBar(this.responseMessage,"");/*Open snackbar with message*/
      this.router.navigate(['/']);/*Navigate to same path*/
    },(error) => {/*On error*/
      this.ngxService.stop();/*Stops the loading symbol*/
      if(error.error?.message){/*If there is a message exists*/
        this.responseMessage = error.error?.message/*Set responseMessage as exist message*/
      } else {
        this.responseMessage = GlobalConstants.genericError;/*Take 'error' message from GlobalConstants object*/
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);/*Pops up a snackbar*/
    })
  }



}
