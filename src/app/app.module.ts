import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
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
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; // เพิ่ม import นี้
// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { ChartComponent } from './chart/chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { CircleChartComponent } from './circle-chart/circle-chart.component';
import { DeviceCardComponent } from './device-card/device-card.component';
import { HttpClientModule } from '@angular/common/http';
import { TableDeviceComponent } from './table-device/table-device.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TableUsersComponent } from './table-users/table-users.component';
import { DeviceAccessGuard } from './service/device-access.guard';
import { AuthService } from './service/auth.service';
import { TableGroupsComponent } from './table-groups/table-groups.component';
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
    DeviceCardComponent,
    TableDeviceComponent,
    LoginComponent,
    SignupComponent,
    AdminDashboardComponent,
    TableUsersComponent,
    TableGroupsComponent,

  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-wg2x3rls3me8udhz.jp.auth0.com',
      clientId: 'bJYCf8w408d6Fdq1wDQEvxGGcEJsmcxd',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ],
  providers: [DeviceAccessGuard, AuthService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
