import { Type } from "@angular/core";

export interface IEzValidationError {
  componentType: Type<any> | null;
  message: string | null;
  forValidators: string[];
}
