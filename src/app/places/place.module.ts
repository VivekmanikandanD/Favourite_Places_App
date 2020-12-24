import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {  ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { PlaceCreateComponent } from "./place-create/place-create.component";
import { PlaceListComponent } from "./place-list/place-list.component";
import { PlaceViewComponent } from "./place-view/place-view.component";
import { SearchPlacesFilterPipe } from "./search-places-filter.pipe";


@NgModule({
  declarations: [
    PlaceCreateComponent,
    PlaceListComponent,
    PlaceViewComponent,
    SearchPlacesFilterPipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ]

})
export class PlacesModule { }
