import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {SnackbarService} from "./snackbar.service";
import jwtDecode from "jwt-decode";
import {GlobalConstants} from "../shared/global-constants";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private authService: AuthService,
              private snackbarService:SnackbarService,
              private router: Router) { }





    canActivate(route: ActivatedRouteSnapshot): boolean{

      //This code takes the Role
      let expectedRoleArray = route.data;
      // @ts-ignore
      expectedRoleArray = expectedRoleArray.expectedRole;


      //We are checking for is there any jwt
      const token: any = localStorage.getItem('token');
      let tokenPayload: any;
      try{
        //If there is a token we are decoding it
        tokenPayload = jwtDecode(token);
      } catch (e) {
        //If there isn't any token we are clearing local storage and logging some error to console
        localStorage.clear()
        console.error('There is no token to authorize');
        //And navigates to main page
        this.router.navigate(['/']);
      }

      //We are initializing a variable for role validation
      let roleValidity = false;

      //Checks in expectedRoleArray
      // @ts-ignore
      for(let i = 0; i < expectedRoleArray.length; i++){
        if(expectedRoleArray[i] == tokenPayload.role){
          roleValidity = true;
        }
      }

      //If token role is user or admin, is authenticated and role has validity
      if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
        if(this.authService.isAuthenticated() && roleValidity){
          //Return access
          return true;
        }
        //If token role is user or admin but is not authenticated or has no validity
        //Open a snackbar and navigate user to path
        this.snackbarService.openSnackBar(GlobalConstants.unauthorized,GlobalConstants.error);
        this.router.navigate(['/cafe/dashboard']);
        return false;
      }

      //Else, clear all and navigate to main page. End of the func
      else{
        this.router.navigate(['/']);
        localStorage.clear()
        return false;
      }
    }
}
