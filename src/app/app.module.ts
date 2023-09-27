import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device/device.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';

// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { ChartComponent } from './chart/chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { CircleChartComponent } from './circle-chart/circle-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    DeviceComponent,
    FooterComponent,
    AboutComponent,
    ProfileComponent,
    HomeComponent,
    AuthButtonComponent,
    //MapComponent,
    ChartComponent,
    CircleChartComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgApexchartsModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-wg2x3rls3me8udhz.jp.auth0.com',
      clientId: 'bJYCf8w408d6Fdq1wDQEvxGGcEJsmcxd',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
