import { Type } from "@angular/core";
import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import IBuilder from "./interfaces/builders/builder.interface";
import {
  IEzFormValidationBuilder,
  IEzFormValidationOptionsBuilder,
} from "./interfaces/builders/ez-option-builder-base.interface";
import { IEzValidationError } from "./interfaces/validatonErrors/ez-validation-error.interface";

export type IEzValidationErrorOptions = IEzValidationError & {
  componentType: Type<any> | null;
  forValidators?: [];
  validators?: ValidatorFn[] | AsyncValidatorFn[];
  isAsync?: boolean;
};

export class EzFormValidationOptionsBuilder<TParentBuilder>
  implements IEzFormValidationOptionsBuilder<TParentBuilder> {
  private _componentType: Type<any> | null = null;
  private _message: string | null = null;

  get validationErrorOptions(): IEzValidationErrorOptions {
    return { message: this._message, componentType: this._componentType };
  }

  constructor(private parentBuilder: TParentBuilder) {}

  and(): TParentBuilder {
    return this.parentBuilder;
  }

  usesComponent(
    componentType: Type<any>
  ): IEzFormValidationOptionsBuilder<TParentBuilder> {
    this._componentType = componentType;
    return this;
  }

  hasMessage(message: string): IEzFormValidationOptionsBuilder<TParentBuilder> {
    this._message = message;
    return this;
  }
}

export class EzFormValidationBuilder<TParentBuilder>
  implements
    IEzFormValidationBuilder<TParentBuilder>,
    IBuilder<IEzValidationErrorOptions> {
  constructor(
    private validators: ValidatorFn[] | AsyncValidatorFn[],
    private isAsync: boolean,
    private parentBuilder: TParentBuilder
  ) {}

  private validationOptionsBuilder = new EzFormValidationOptionsBuilder<
    IEzFormValidationBuilder<TParentBuilder>
  >(this);

  that(): IEzFormValidationOptionsBuilder<IEzFormValidationBuilder<any>> {
    return this.validationOptionsBuilder;
  }

  and() {
    return this.parentBuilder;
  }

  build(): IEzValidationErrorOptions {
    const validationErrorOptions = this.validationOptionsBuilder
      .validationErrorOptions;
    validationErrorOptions.isAsync = this.isAsync;
    validationErrorOptions.validators = this.validators;
    validationErrorOptions.forValidators = [];

    return validationErrorOptions;
  }
}
