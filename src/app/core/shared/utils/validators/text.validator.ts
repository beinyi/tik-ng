import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Тримит строку и проверяет на Boolean()
 */
export function requiredTrim(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value;

    const trimValue = value.trim();

    const valid = Boolean(trimValue);

    return !valid ? { requiredTrim: true } : null;
  };
}
