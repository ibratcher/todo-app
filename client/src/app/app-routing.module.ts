import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CreateTaskComponent} from "./create-task/create-task.component";
import {CompletedComponent} from "./completed/completed.component";
import {AuthGuard} from "@auth0/auth0-angular";

const appRoutes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'new', component: CreateTaskComponent, canActivate: [AuthGuard]},
  {path: 'completed', component: CompletedComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
