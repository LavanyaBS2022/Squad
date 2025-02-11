import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { CreateVisitComponent } from './features/visits/create-visit/create-visit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule , provideHttpClient, withFetch} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { SpinnerService } from './core/services/spinner service/spinner.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { VisitListComponent } from './features/visits/visit-list/visit-list.component';
import { MaterialModule } from './shared/Materials/material.module';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent, 
    SidebarComponent,
    CreateVisitComponent,
    VisitListComponent,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
      SpinnerService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor, 
        multi: true
      },
      provideHttpClient(withFetch()) ,
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
