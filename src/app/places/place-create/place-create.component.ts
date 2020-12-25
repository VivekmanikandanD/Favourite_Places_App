import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";
import { Subscription } from "rxjs";
import { AuthDataService } from "src/app/auth/auth-data.service";
import { requiredFileType } from "./requiredFileType";

@Component({
  selector: "app-place-create",
  templateUrl: "./place-create.component.html",
  styleUrls: ["./place-create.component.css"]
})
export class PlaceCreateComponent implements OnInit, OnDestroy {
  enteredname = "";
  entereddescription = "";
  isLoading = false;
  form: FormGroup
  private mode = "create";
  private placeId: string;
  private authStatusSub: Subscription;
  public place: Place;
  imagePreview: string;
  constructor(public placesService: PlacesService, public route: ActivatedRoute, private authDataService: AuthDataService) { }

  ngOnInit() {
    this.authStatusSub = this.authDataService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = authStatus;
    })
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      address: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, [requiredFileType()])
    });
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('placeId')) {
        this.mode = "edit";
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
          this.form.setValue({
            name: this.place.name,
            description: this.place.description,
            address: this.place.address,
            image: this.place.imagePath
          });
        });
      } else {
        this.mode = "create"
        this.placeId = null;
        this.isLoading = false;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
  }

  onSavePlace() {
    this.form.get('image').setValidators(Validators.required);
    this.form.get('image').updateValueAndValidity();
    if (this.form.invalid) {
      return;
    } else {
      this.mode === 'create' ?
        this.placesService.addPlace(
          this.form.value.name,
          this.form.value.description,
          this.form.value.address,
          this.form.value.image) :
        this.placesService.updatePlace(
          this.placeId,
          this.form.value.name,
          this.form.value.description,
          this.form.value.address,
          this.form.value.image);

      this.form.reset();
    }

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
