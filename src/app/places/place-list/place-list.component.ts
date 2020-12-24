import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from 'rxjs';
import { AuthDataService } from "src/app/auth/auth-data.service";

import { Place } from "../place.model";
import { PlacesService } from "../places.service";

@Component({
  selector: "app-place-list",
  templateUrl: "./place-list.component.html",
  styleUrls: ["./place-list.component.css"]
})
export class PlaceListComponent implements OnInit, OnDestroy {
  places: Place[] = [];
  isLoading = false;
  pageLength: number = 3;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1, 2, 5, 10, 15];
  currentPage: number = 1;
  userId: string;
  private placesSub: Subscription;
  public isLoggedIn = false;
  placename: string;


  constructor(public placesService: PlacesService, private authDataService: AuthDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.placesService.getPlaces(this.pageSize, this.currentPage);
    this.userId = this.authDataService.getUserId();
    this.placesSub =
      this.placesService.getPlaceUpdateListener().
        subscribe((response: { places: Place[], totalPlaceCount: number }) => {
          this.isLoading = false;
          this.places = response.places;
          this.pageLength = response.totalPlaceCount;
        });
    this.authDataService.getAuthStatusListener().subscribe(result => {
      this.isLoggedIn = result;
      this.userId = this.authDataService.getUserId();
    });
    this.isLoggedIn = this.authDataService.getLoggedInStatus();
  }

  onDelete(placeId: string) {
    this.isLoading = true;
    this.placesService.deletePlace(placeId).subscribe(() => {
      this.placesService.getPlaces(this.pageSize, this.currentPage);
    }, error => {
      this.isLoading = false;
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.placesService.getPlaces(this.pageSize, this.currentPage);
  }

  ngOnDestroy() {
    this.placesSub.unsubscribe();
  }
}
