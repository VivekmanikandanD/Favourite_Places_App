import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceListComponent } from './places/place-list/place-list.component';
import { PlaceCreateComponent } from './places/place-create/place-create.component';
import { PlaceViewComponent } from './places/place-view/place-view.component';
import { AuthDataGuard } from './auth/auth-data.guard';

const routes: Routes = [
  { path: "", component: PlaceListComponent, canActivate: [AuthDataGuard] },
  { path: "create", component: PlaceCreateComponent, canActivate: [AuthDataGuard] },
  { path: "edit/:placeId", component: PlaceCreateComponent, canActivate: [AuthDataGuard] },
  { path: "view/:placeId", component: PlaceViewComponent, canActivate: [AuthDataGuard] },
  { path: "auth", loadChildren:() => import('./auth/auth.module').then(m => m.AuthModule) },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthDataGuard]
})
export class AppRoutingModule { }
