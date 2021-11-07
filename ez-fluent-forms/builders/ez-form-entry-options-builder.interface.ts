import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../types/form/form-status.type";
import { UpdateOn } from "../types/form/update-on.type";
import { IEzFormValidationClientBuilder } from "./validation/ez-form-validation-builder.interface";

export interface IEzFormEntryOptionBuilder<TParentBuilder> {
  hasValidator(
    valdator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<TParentBuilder>;
  hasValidators(
    valdator: ValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<TParentBuilder>;
  hasAsyncValidator(
    valdator: AsyncValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<TParentBuilder>;
  hasAsyncValidators(
    valdator: AsyncValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<TParentBuilder>;
  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormEntryOptionBuilder<TParentBuilder>;
  listensForStatusChanges(
    valueChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<TParentBuilder>;
  updatesOn(updateOn: UpdateOn): IEzFormEntryOptionBuilder<TParentBuilder>;
  mapsToModel<TModel>(
    modelMapper: (value: any) => TModel
  ): IEzFormEntryOptionBuilder<TParentBuilder>;
}
