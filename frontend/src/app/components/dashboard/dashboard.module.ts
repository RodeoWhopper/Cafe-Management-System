import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../material-component/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule} from "@angular/router";
import {DashboardRoutes} from "./dashboard.routing";
import {DashboardComponent} from "./dashboard.component";



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(DashboardRoutes)
  ]
})
export class DashboardModule { }
