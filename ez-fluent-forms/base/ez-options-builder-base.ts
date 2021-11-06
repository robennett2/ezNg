import {
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControlOptions,
} from "@angular/forms";
import { Observable } from "rxjs";
import { EzFormValidationBuilder } from "../ez-form-validation-builder";
import {
  IEzFormValidationBuilder,
  IEzOptionBuilderBase,
} from "../interfaces/builders/ez-option-builder-base.interface";
import { EzValidationMessageService } from "../services/ez-validation-message.service";
import { FormStatus } from "../new/types/form/form-status.type";
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

  private _validatorBuilders: EzFormValidationBuilder<TParentBuilder>[] = [];
  get validatorBuilders(): EzFormValidationBuilder<TParentBuilder>[] {
    return this._validatorBuilders;
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

  constructor(
    private ezValidationErrorService: EzValidationMessageService,
    private parentBuilder: TParentBuilder
  ) {}

  and(): TParentBuilder {
    return this.parentBuilder;
  }

  hasValidator(
    validator: ValidatorFn
  ): IEzFormValidationBuilder<TParentBuilder> {
    const validatorBuilder = new EzFormValidationBuilder<TParentBuilder>(
      [validator],
      false,
      this.parentBuilder
    );

    this._validatorBuilders.push(validatorBuilder);

    return validatorBuilder;
  }

  hasValidators(
    validators: ValidatorFn[]
  ): IEzFormValidationBuilder<TParentBuilder> {
    throw new Error("Method not implemented.");
  }

  hasAsyncValidator(
    validator: AsyncValidatorFn
  ): IEzFormValidationBuilder<TParentBuilder> {
    throw new Error("Method not implemented.");
  }

  hasAsyncValidators(
    validators: AsyncValidatorFn[]
  ): IEzFormValidationBuilder<TParentBuilder> {
    throw new Error("Method not implemented.");
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
    let validators: ValidatorFn[] = [];
    let asyncValidators: AsyncValidatorFn[] = [];

    this._validatorBuilders.forEach((builder) => {
      const builderOptions = builder.build();
      if (builderOptions.validators) {
        if (builderOptions.isAsync) {
          asyncValidators.push(
            ...(builderOptions.validators as AsyncValidatorFn[])
          );
        } else {
          validators.push(...(builderOptions.validators as ValidatorFn[]));
        }
      }
    });

    return {
      validators: validators,
      asyncValidators: asyncValidators,
      updateOn: this.updateOn,
    };
  }
}
