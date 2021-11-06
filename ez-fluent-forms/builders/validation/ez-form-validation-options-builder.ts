import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import { EzFormValidationOptionsBuilder } from "./ez-form-validation-builder";
import { IEzFormValidationBuilder } from "./ez-form-validation-builder.interface";
import { IEzFormValidationOptionsBuilder } from "./ez-form-validation-options-builder.interface";

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
