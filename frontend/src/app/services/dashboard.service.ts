import { Injectable } from '@angular/core';
import {GlobalConstants} from "../shared/global-constants";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  backendUrl = GlobalConstants.url;

  constructor(private httpClient:HttpClient) { }

  getDetails(){
    return this.httpClient.get(this.backendUrl + '/dashboard/details');
  }
}
