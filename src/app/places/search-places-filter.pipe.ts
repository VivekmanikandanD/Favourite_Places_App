import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "SearchPlacesFilter"
})
export class SearchPlacesFilterPipe implements PipeTransform {
    transform(value: any[], args: string) {
        let searchFilter: string = args ? args.toLowerCase() : null;
        return searchFilter ? value.filter(places =>
            places.name.toLowerCase().startsWith(searchFilter) != false) : value;

    }
}