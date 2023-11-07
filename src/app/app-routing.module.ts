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
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './service/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
const routes: Routes = [
  { path: '', redirectTo: '/home-component', pathMatch: 'full'},
  { path: 'dashboard-component',component: DashboardComponent },
  { path: 'device-component',component: DeviceComponent },
  { path: 'navbar-component',component: NavbarComponent },
  { path: 'footer-component',component: FooterComponent },
  { path: 'about-component',component: AboutComponent },
  { path: 'profile-component',component: ProfileComponent , canActivate: [AuthGuard]},
  { path: 'chart-component',component: ChartComponent },
  { path: 'circle-component',component:CircleChartComponent},
  { path: 'dashboard-component/:id', component: DeviceCardComponent },
  { path: 'table-device-component', component:TableDeviceComponent},
  { path: 'login-component', component:LoginComponent},
  { path: 'signup-component', component:SignupComponent},
  { path: 'admin',component:AdminDashboardComponent ,canActivate: [AuthGuard],data: { roles: ['admin']}},
  { path: '**',component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
