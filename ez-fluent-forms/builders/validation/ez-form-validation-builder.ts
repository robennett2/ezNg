import { Type } from "@angular/core";
import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import {
  IEzFormValidationBuilder,
  IEzFormValidationOptionsBuilder,
} from "./ez-form-validation-builder.interface";

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
  ): IEzFormValidationOptionsBuilder<
    IEzFormValidationBuilder<TFormValidationParentBuilder>
  > {
    this.message = message;
    return this;
  }

  usesComponent(
    componentType: Type<any>
  ): IEzFormValidationOptionsBuilder<
    IEzFormValidationBuilder<TFormValidationParentBuilder>
  > {
    this.componentType = componentType;
    return this;
  }
}

export class EzFormValidationBuilder<TParentBuilder>
  implements IEzFormValidationBuilder<TParentBuilder> {
  constructor(
    entryName: string,
    errors: string[],
    isAsync: boolean,
    validatorFns: ValidatorFn[] | AsyncValidatorFn[],
    private ezValidationMessageService: EzValidationMessageService,
    private parentBuilder: TParentBuilder
  ) {
    this.formValidationOptionsBuilder = new EzFormValidationOptionsBuilder(
      entryName,
      errors,
      isAsync,
      validatorFns,
      this
    );
  }

  private formValidationOptionsBuilder: EzFormValidationOptionsBuilder<TParentBuilder>;

  that(): IEzFormValidationOptionsBuilder<
    IEzFormValidationBuilder<TParentBuilder>
  > {
    return this.formValidationOptionsBuilder;
  }

  and(): TParentBuilder {
    return this.parentBuilder;
  }

  build(): IEzValidationOptions {
    const config = this.formValidationOptionsBuilder.build();
    this.ezValidationMessageService.registerValidatorConfiguration(config);
    return config;
  }
}
