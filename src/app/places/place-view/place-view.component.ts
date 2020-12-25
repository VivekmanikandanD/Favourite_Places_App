import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";
import { Subscription } from "rxjs";
import { AuthDataService } from "src/app/auth/auth-data.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-place-view",
  templateUrl: "./place-view.component.html",
  styleUrls: ["./place-view.component.css"]
})
export class PlaceViewComponent implements OnInit, OnDestroy {
  enteredname = "";
  entereddescription = "";
  isLoading = false;
  imagePreview: string;
  userId: string;
  private placeId: string;
  private authStatusSub: Subscription;
  public place: Place;
  constructor(public placesService: PlacesService, public route: ActivatedRoute,private authDataService:AuthDataService,private location:Location,private router:Router
   ) { }

  ngOnInit() {
    this.authStatusSub = this.authDataService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = authStatus;
      this.userId = this.authDataService.getUserId();
      console.log(this.userId)
    });
    this.userId = this.authDataService.getUserId();
    this.isLoading =this.authDataService.getLoggedInStatus();
    console.log(this.userId)
   
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('placeId')) {
        this.placeId = param.get('placeId');
        this.isLoading = true;
        this.placesService.getPlace(this.placeId).subscribe(placeObj => {
          this.isLoading = false;
          this.place = {
            id: placeObj._id,
            name: placeObj.name,
            description: placeObj.description,
            address: placeObj.address,
            imagePath: placeObj.imagePath,
            createdBy: placeObj.createdBy
          };
          this.imagePreview = placeObj.imagePath;
          console.log(this.place)
        });
      } else {
        this.placeId = null;
        this.isLoading = false;
      }
    });
  }

  
  onDelete(placeId: string) {
    this.isLoading = true;
    this.placesService.deletePlace(placeId).subscribe(() => {
      this.router.navigate([""]);
    },error => {
      this.isLoading = false;
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
