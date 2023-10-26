import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device/device.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from 'ng-apexcharts';
import { CircleChartComponent } from "./circle-chart/circle-chart.component";
import { DeviceCardComponent } from './device-card/device-card.component';
import { TableDeviceComponent } from './table-device/table-device.component';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  { path: '', redirectTo: '/home-component', pathMatch: 'full'},
  { path: 'dashboard-component',component: DashboardComponent },
  { path: 'device-component',component: DeviceComponent },
  { path: 'navbar-component',component: NavbarComponent },
  { path: 'footer-component',component: FooterComponent },
  { path: 'about-component',component: AboutComponent },
  { path: 'profile-component',component: ProfileComponent },
  { path: '**',component: HomeComponent },
  { path: 'chart-component',component: ChartComponent },
  { path: 'circle-component',component:CircleChartComponent},
  { path: 'dashboard-component/:id', component: DeviceCardComponent },
  { path: 'tabledevice-component', component:TableDeviceComponent},
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'user-profile/:id', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
