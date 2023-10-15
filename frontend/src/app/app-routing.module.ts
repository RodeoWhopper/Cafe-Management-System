import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import {FullComponent} from "./components/full/full.component";
import {RouteGuardService} from "./services/route-guard.service";

const routes: Routes = [
  {path:'', component: HomeComponent},
  {
    path:'cafe',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./components/material-component/material.module').then(m => m.MaterialModule),
        canActivate:[RouteGuardService],
        data:{
          expectedRole:['admin','user']
        }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate:[RouteGuardService],
        data:{
          expectedRole:['admin','user']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
