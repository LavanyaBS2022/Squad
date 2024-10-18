import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomValidationDirective } from './shared/directives/custom-validation.directive';
import { CustomDatePipePipe } from './shared/pipes/custom-date-pipe.pipe';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { CreateVisitComponent } from './features/visits/create-visit/create-visit.component';
import { VisitListComponent } from './features/visits/visit-list/visit-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/Materials/material.module';

@NgModule({
  declarations: [
    AppComponent,
    CustomValidationDirective,
    CustomDatePipePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent, 
    SidebarComponent,
    CreateVisitComponent,
    VisitListComponent,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
