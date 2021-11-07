import { Type } from "@angular/core";
import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import { IEzFormValidationBuilder } from "./ez-form-validation-builder.interface";
import {
  IEzFormValidationOptionsBuilder,
  IEzFormValidationOptionsClientBuilder,
} from "./ez-form-validation-options-builder.interface";

export class EzFormValidationOptionsBuilder<TFormValidationParentBuilder>
  implements
    IEzFormValidationOptionsBuilder<
      IEzFormValidationBuilder<TFormValidationParentBuilder>
    > {
  private message?: string;
  private componentType?: Type<any>;

  constructor(
    private entryName: string,
    private errors: string[],
    private isAsync: boolean,
    private validatorFns: ValidatorFn[] | AsyncValidatorFn[],
    private parentBuilder: IEzFormValidationBuilder<TFormValidationParentBuilder>
  ) {}

  and(): IEzFormValidationBuilder<TFormValidationParentBuilder> {
    return this.parentBuilder;
  }

  build(): IEzValidationOptions {
    return {
      message: this.message,
      componentType: this.componentType,
      entryName: this.entryName,
      errorNames: this.errors,
      isAsync: this.isAsync,
      validatorFns: this.validatorFns,
    };
  }

  showsMessage(
    message: string
  ): IEzFormValidationOptionsClientBuilder<
    IEzFormValidationBuilder<TFormValidationParentBuilder>
  > {
    this.message = message;
    return this;
  }

  usesComponent(
    componentType: Type<any>
  ): IEzFormValidationOptionsClientBuilder<
    IEzFormValidationBuilder<TFormValidationParentBuilder>
  > {
    this.componentType = componentType;
    return this;
  }
}
