import { Type } from "@angular/core";
import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../../new/types/form/form-status.type";
import { UpdateOn } from "../../new/types/form/update-on.type";

export interface IEzOptionBuilderBase<
  TOptionBuilder,
  TParentBuilder,
  TValue = any
> {
  and(): TParentBuilder;

  shouldUpdateOn(updateOn: UpdateOn): TOptionBuilder;

  handlesValueChanges(
    callback: (valueChanges$: Observable<TValue>) => any
  ): TOptionBuilder;
  handlesStatusChanges(
    callback: (statusChanges$: Observable<FormStatus>) => any
  ): TOptionBuilder;

  hasValidator(
    validator: ValidatorFn
  ): IEzFormValidationBuilder<TParentBuilder>;
  hasValidators(
    validators: ValidatorFn[]
  ): IEzFormValidationBuilder<TParentBuilder>;
  hasAsyncValidator(
    validator: AsyncValidatorFn
  ): IEzFormValidationBuilder<TParentBuilder>;
  hasAsyncValidators(
    validators: AsyncValidatorFn[]
  ): IEzFormValidationBuilder<TParentBuilder>;
}

export interface IEzFormValidationOptionsBuilder<TParentBuilder> {
  and(): TParentBuilder;
  usesComponent(
    componentType: Type<any>
  ): IEzFormValidationOptionsBuilder<TParentBuilder>;
  hasMessage(message: string): IEzFormValidationOptionsBuilder<TParentBuilder>;
}

export interface IEzFormValidationBuilder<TParentBuilder> {
  that(): IEzFormValidationOptionsBuilder<
    IEzFormValidationBuilder<TParentBuilder>
  >;
  and(): TParentBuilder;
}
