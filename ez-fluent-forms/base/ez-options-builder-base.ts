import {
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControlOptions,
} from "@angular/forms";
import { Observable } from "rxjs";
import { IEzOptionBuilderBase } from "../interfaces/ez-option-builder-base.interface";
import { FormStatus } from "../types/form-status.type";
import { UpdateOn } from "../types/update-on.type";

export default class EzOptionsBuilderBase<
  TOptionBuilder,
  TParentBuilder,
  TValue = any
> implements IEzOptionBuilderBase<TOptionBuilder, TParentBuilder, TValue> {
  private _validators: ValidatorFn[] = [];
  private _asyncValidators: AsyncValidatorFn[] = [];
  private _updateOn: UpdateOn = "change";
  private _onValueChangesCallback:
    | ((obs: Observable<TValue>) => any)
    | null = null;

  private _onStatusChangesCallback:
    | ((obs: Observable<FormStatus>) => any)
    | null = null;

  get validators(): ValidatorFn[] | null {
    return this._validators.length > 0 ? this._validators : null;
  }

  get asyncValidators(): AsyncValidatorFn[] | null {
    return this._asyncValidators.length > 0 ? this._asyncValidators : null;
  }

  get updateOn(): UpdateOn {
    return this._updateOn;
  }

  get onValueChangesCallback(): ((obs: Observable<any>) => any) | null {
    return this._onValueChangesCallback;
  }

  get onStatusChangesCallback(): ((obs: Observable<FormStatus>) => any) | null {
    return this._onStatusChangesCallback;
  }

  constructor(private parentBuilder: TParentBuilder) {}

  and(): TParentBuilder {
    return this.parentBuilder;
  }

  hasValidator(validator: ValidatorFn): TOptionBuilder {
    this._validators.push(validator);
    return (this as unknown) as TOptionBuilder;
  }

  hasValidators(validators: ValidatorFn[]): TOptionBuilder {
    this._validators.push(...validators);
    return (this as unknown) as TOptionBuilder;
  }

  hasAsyncValidator(validator: AsyncValidatorFn): TOptionBuilder {
    this._asyncValidators.push(validator);
    return (this as unknown) as TOptionBuilder;
  }

  hasAsyncValidators(validators: AsyncValidatorFn[]): TOptionBuilder {
    this._asyncValidators.push(...validators);
    return (this as unknown) as TOptionBuilder;
  }

  shouldUpdateOn(updateOn: UpdateOn): TOptionBuilder {
    this._updateOn = updateOn;
    return (this as unknown) as TOptionBuilder;
  }

  handlesValueChanges(
    callback: (valueChanges$: Observable<TValue>) => any
  ): TOptionBuilder {
    this._onValueChangesCallback = callback;
    return (this as unknown) as TOptionBuilder;
  }

  handlesStatusChanges(
    callback: (statusChanges$: Observable<FormStatus>) => any
  ): TOptionBuilder {
    this._onStatusChangesCallback = callback;
    return (this as unknown) as TOptionBuilder;
  }

  public get abstractControlOptions(): AbstractControlOptions {
    return {
      validators: this.validators,
      asyncValidators: this.asyncValidators,
      updateOn: this.updateOn,
    };
  }
}
