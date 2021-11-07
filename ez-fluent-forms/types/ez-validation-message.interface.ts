import { Type } from "@angular/core";

export interface IEzValidationMessage {
  errorNames: string[];
  message?: string;
  componentType?: Type<any>;
}
