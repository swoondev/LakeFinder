import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

import { ApiService } from './api.service';

import { HomePageComponent } from './home-page/home-page.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchByLakeComponent } from './search-by-lake/search-by-lake.component';
import { SearchByLakeFeaturesComponent } from './search-by-lake-features/search-by-lake-features.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SearchByLakeComponent,
    SearchByLakeFeaturesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatSelectModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
