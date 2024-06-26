import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { SharedModule } from './shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    VerifyEmailComponent,
    CreateOrganizationComponent,
    PasswordChangeComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxUiLoaderModule,
    SharedModule,
    SuperAdminModule,
    NgbModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
