import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModules} from "../../shared/material-module";
import {MaterialRoutes} from "./material.routing";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CdkTableModule} from "@angular/cdk/table";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModules,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ]
})
export class MaterialModule { }
