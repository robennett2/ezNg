import {
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControlOptions,
} from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../types/form-status.type";
import { UpdateOn } from "../types/update-on.type";

export default class EzFormBuilderBase<TBuilder, TValue> {
  private _validators: ValidatorFn[] = [];
  private _asyncValidators: AsyncValidatorFn[] = [];
  private _updateOn: UpdateOn = "change";
  private _onValueChangesCallback:
    | ((obs: Observable<TValue>) => any)
    | null = null;

  private _onStatusChangesCallback:
    | ((obs: Observable<FormStatus>) => any)
    | null = null;

  protected get validators(): ValidatorFn[] | null {
    return this._validators.length > 0 ? this._validators : null;
  }

  protected get asyncValidators(): AsyncValidatorFn[] | null {
    return this._asyncValidators.length > 0 ? this._asyncValidators : null;
  }

  protected get updateOn(): UpdateOn {
    return this._updateOn;
  }

  protected get onValueChangesCallback():
    | ((obs: Observable<any>) => any)
    | null {
    return this._onValueChangesCallback;
  }

  protected get onStatusChangesCallback():
    | ((obs: Observable<FormStatus>) => any)
    | null {
    return this._onStatusChangesCallback;
  }

  hasValidator(validator: ValidatorFn): TBuilder {
    this._validators.push(validator);
    return (this as unknown) as TBuilder;
  }

  withValidators(validators: ValidatorFn[]): TBuilder {
    this._validators.push(...validators);
    return (this as unknown) as TBuilder;
  }

  withAsyncValidator(validator: AsyncValidatorFn): TBuilder {
    this._asyncValidators.push(validator);
    return (this as unknown) as TBuilder;
  }

  withAsyncValidators(validators: AsyncValidatorFn[]): TBuilder {
    this._asyncValidators.push(...validators);
    return (this as unknown) as TBuilder;
  }

  shouldUpdateOn(updateOn: UpdateOn): TBuilder {
    this._updateOn = updateOn;
    return (this as unknown) as TBuilder;
  }

  handleValueChanges(
    callback: (valueChanges$: Observable<TValue>) => any
  ): TBuilder {
    this._onValueChangesCallback = callback;
    return (this as unknown) as TBuilder;
  }

  handleStatusChanges(
    callback: (statusChanges$: Observable<FormStatus>) => any
  ): TBuilder {
    this._onStatusChangesCallback = callback;
    return (this as unknown) as TBuilder;
  }

  protected get abstractControlOptions(): AbstractControlOptions {
    return {
      validators: this.validators,
      asyncValidators: this.asyncValidators,
      updateOn: this.updateOn,
    };
  }
}
