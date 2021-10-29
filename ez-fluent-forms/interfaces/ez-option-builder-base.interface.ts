import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../types/form-status.type";
import { UpdateOn } from "../types/update-on.type";

export interface IEzOptionBuilderBase<
  TOptionBuilder,
  TParentBuilder,
  TValue = any
> {
  and(): TParentBuilder;
  hasValidator(validator: ValidatorFn): TOptionBuilder;
  hasValidators(validators: ValidatorFn[]): TOptionBuilder;
  hasAsyncValidator(validator: AsyncValidatorFn): TOptionBuilder;
  hasAsyncValidators(validators: AsyncValidatorFn[]): TOptionBuilder;
  shouldUpdateOn(updateOn: UpdateOn): TOptionBuilder;
  handlesValueChanges(
    callback: (valueChanges$: Observable<TValue>) => any
  ): TOptionBuilder;
  handlesStatusChanges(
    callback: (statusChanges$: Observable<FormStatus>) => any
  ): TOptionBuilder;
}
