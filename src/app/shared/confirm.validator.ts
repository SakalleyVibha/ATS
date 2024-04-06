import { AbstractControl } from '@angular/forms';

export function ConfirmedValidator(formGroup: AbstractControl) {
    const control = formGroup.get('password');
    const matchingControl = formGroup.get('confirmpassword');
    if (matchingControl?.errors && !matchingControl.errors['ConfirmedValidator']) {
        return null;
    }
    if (control?.value !== matchingControl?.value) {
        return formGroup.get('confirmpassword')?.setErrors({ confirmpassword: true });
    }
}