import { ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../types/form/form-status.type";
import { IEzFormValidationBuilder } from "./validation/ez-form-validation-builder.interface";

export interface IEzFormEntryOptionBuilder<TParentBuilder> {
  hasValidator(
    valdator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationBuilder<TParentBuilder>;
  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormEntryOptionBuilder<TParentBuilder>;
  listensForStatusChanges(
    valueChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<TParentBuilder>;
}
