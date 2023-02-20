import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device/device.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from 'ng-apexcharts';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
