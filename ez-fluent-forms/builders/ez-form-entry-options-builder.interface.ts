import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../types/form/form-status.type";
import { UpdateOn } from "../types/form/update-on.type";
import { IEzFormEntryOptions } from "../types/options/ez-form-entry-options.interface";
import { IEzBuildProvider } from "./ez-base-builders.interface";
import { IEzFormValidationClientBuilder } from "./validation/ez-form-validation-builder.interface";

export type IEzFormEntryOptionBuilder<
  TParentBuilder,
  TOptionsProvider
> = IEzBuildProvider<IEzFormEntryOptions> &
  IEzFormEntryOptionClientBuilder<TParentBuilder, TOptionsProvider> & {};

export interface IEzFormEntryOptionClientBuilder<
  TParentBuilder,
  TOptionsProvider
> {
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
  ): TOptionsProvider;
  listensForStatusChanges(
    valueChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): TOptionsProvider;
  updatesOn(updateOn: UpdateOn): TOptionsProvider;
  mapsToModel(modelInstance: any, controlPrefix?: string): TOptionsProvider;
}
