import { Type } from "@angular/core";
import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";

export interface IEzValidationOptions {
  errorNames: string[];
  entryName: string;
  isAsync: boolean;
  validatorFns: ValidatorFn[] | AsyncValidatorFn[];
  message?: string;
  componentType?: Type<any>;
}
