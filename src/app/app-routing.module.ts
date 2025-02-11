import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { CreateVisitComponent } from './features/visits/create-visit/create-visit.component';
import { VisitListComponent } from './features/visits/visit-list/visit-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-visit', component: CreateVisitComponent },
  { path: 'visit-list', component: VisitListComponent },
  { path: '**', component: NotFoundComponent }, 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
