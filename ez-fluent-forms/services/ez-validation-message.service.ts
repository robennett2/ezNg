import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { EzValidationMessageComponent } from "../components/ez-validation-message/ez-validation-message.component";
import { IEzValidationErrorOptions } from "../ez-form-validation-builder";
import { IEzValidationError } from "../interfaces/validatonErrors/ez-validation-error.interface";
import { FormStatus } from "../new/types/form/form-status.type";

@Injectable({
  providedIn: "root",
})
export class EzValidationMessageService {
  private controlToMessageMap: {
    [formControlName: string]: EzValidationMessageComponent;
  } = {};
  private errorToErrorOptions: {
    [error: string]: IEzValidationErrorOptions;
  } = {};
  private formGroups: FormGroup[] = [];

  registerMessageComponentForFormAndControl(
    component: EzValidationMessageComponent,
    formGroup: FormGroup,
    formControlName: string
  ) {
    this.formGroups.push(formGroup);
    this.controlToMessageMap[formControlName] = component;

    formGroup.controls[formControlName].statusChanges
      .pipe(filter((status: FormStatus) => status === "INVALID"))
      .subscribe(() => {
        const errors: string[] = [];
        for (const controlName in this.controlToMessageMap) {
          if (this.controlToMessageMap.hasOwnProperty(controlName)) {
            const control = formGroup.get(controlName);
            if (
              control &&
              control.errors &&
              (control.touched || control.dirty) &&
              !control.valid
            ) {
              for (const errorName in control.errors) {
                if (control.errors.hasOwnProperty(errorName))
                  errors.push(errorName);
              }
            }
          }
        }

        const errorOptions: IEzValidationErrorOptions[] = [];
        errors.forEach((error) => {
          if (this.errorToErrorOptions.hasOwnProperty(error))
            errorOptions.push(this.errorToErrorOptions[error]);
        });

        this.validationErrorOptionsSubject.next(errorOptions);
      });
  }

  private validationErrorOptionsSubject = new ReplaySubject<
    IEzValidationErrorOptions[]
  >();
  get validationErrors$(): Observable<IEzValidationErrorOptions[]> {
    return this.validationErrorOptionsSubject.asObservable();
  }
}
