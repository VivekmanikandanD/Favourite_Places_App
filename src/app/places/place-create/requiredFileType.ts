import { FormControl } from "@angular/forms";

export function requiredFileType() {
    const MIME_TYPE_MAP = {
        'jpeg': 'jpeg',
        'jpg': 'jpg',
        'png': 'png'
      };
    return function (control: FormControl) {
      const file = control.value;
      if ( file && file.name) {
        const extension = file.name.split('.')[1].toLowerCase();
        const isValid = MIME_TYPE_MAP[extension.toLowerCase()];
        if (isValid) {
            return null;
        } else {
            return {
                requiredFileType: true
              };
        }
      }
  
      return null;
    };
  }