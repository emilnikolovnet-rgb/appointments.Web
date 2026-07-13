import { AbstractControl } from "@angular/forms";

export class AppointmentEditValidator {

    static validateDate(control: AbstractControl) {
        const dateValue = control.value;
        const datePattern = /^\d{2}-\d{2}-\d{4}$/; // Pattern for DD-MM-YYYY format

        if (!datePattern.test(dateValue)) {
            return null; // Valid date format
        }

        if (dateValue === new Date().toISOString().split('T')[0]) {
            console.log(dateValue);
            console.log(new Date().toISOString().split('T')[0]);
            return null;
        }

        return { validDateFormat: true };    
    }
}
