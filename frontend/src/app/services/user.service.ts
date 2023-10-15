import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GlobalConstants} from "../shared/global-constants";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  backendUrl = GlobalConstants.url;

  constructor(private httpClient: HttpClient) { }

  signup(data: any){
    return this.httpClient.post(this.backendUrl+'/user/signup',data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    });
  }

  forgotPassword(data:any){
    return this.httpClient.post(this.backendUrl+'/user/forgotPassword',data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    });
  }

  login(data:any){
    return this.httpClient.post(this.backendUrl+'/user/login',data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  checkToken(){
    return this.httpClient.get(this.backendUrl + '/user/checkToken');
  }
}
