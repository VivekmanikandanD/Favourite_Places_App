import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Place } from './place.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/places/";

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private places: Place[] = [];
  private placesUpdated = new Subject<{ places: Place[], totalPlaceCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPlaces(pageSize: number, currentPage: number): void {
    const queryParams = `?pagesize=${pageSize}&currentpage=${currentPage}`;
    this.http.get<{ message: string, places: any, totalPlaceCount: number }>
      (BACKEND_URL + queryParams)
      .pipe(map((placeData) => {
        return {
          places: placeData.places.map(place => {
            return {
              name: place.name,
              description: place.description,
              address: place.address,
              id: place._id,
              imagePath: place.imagePath,
              createdBy: place.createdBy
            }
          }),
          totalPlaceCount: placeData.totalPlaceCount
        }
      }))
      .subscribe((transformedPlaces) => {
        this.places = transformedPlaces.places;
        this.placesUpdated.next({ places: [...this.places], totalPlaceCount: transformedPlaces.totalPlaceCount });
      });
  }

  getPlaceUpdateListener(): Observable<{ places: Place[], totalPlaceCount: number }> {
    return this.placesUpdated.asObservable();
  }

  getPlace(placeId: string) {
    return this.http.get<{ _id: string, name: string, description: string, address: string, imagePath: string, createdBy: string }>(BACKEND_URL + placeId);
  }

  addPlace(name: string, description: string,address: string, image: File): void {
    const placeData = new FormData();
    placeData.append("name", name);
    placeData.append("description", description);
    placeData.append("image", image, name);
    placeData.append("address", address);
    this.http.post<{ message: string, place: Place }>(BACKEND_URL, placeData).subscribe((response) => {
      this.router.navigate(["/"]);
    });
  }

  updatePlace(placeId: string, name: string, description: string,address:string, image: File | string): void {
    let place;
    if (typeof (image) === "string") {
      place = {
        id: placeId,
        name: name,
        description: description,
        address: address,
        image: image
      };
    } else {
      place = new FormData();
      place.append("id", placeId);
      place.append("name", name);
      place.append("description", description);
      place.append("address", address);
      place.append("image", image, name);
    }

    this.http.put(BACKEND_URL + placeId, place).subscribe((response) => {
      this.router.navigate(["/"]);
    });
  }

  deletePlace(placeId: string) {
    return this.http.delete(BACKEND_URL + placeId);
  }
}
