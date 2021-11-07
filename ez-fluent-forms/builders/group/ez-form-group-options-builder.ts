import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import { EzFormValidationBuilder } from "../validation/ez-form-validation-builder";
import { IEzFormValidationBuilder } from "../validation/ez-form-validation-builder.interface";
import { IEzFormGroupClientBuilder } from "./ez-form-group-builder.interface";
import {
  IEzFormGroupOptionBuilder,
  IEzFormGroupOptionClientBuilder,
} from "./ez-form-group-options-builder.interface";

export class EzFormGroupOptionsBuilder implements IEzFormGroupOptionBuilder {
  private updateOn: UpdateOn = "change";
  private valueChangesSubscribers: ((
    valueChanges$: Observable<any>
  ) => void)[] = [];
  private statusChangesSubscribers: ((
    statusChanges$: Observable<FormStatus>
  ) => void)[] = [];
  private formValidationBuilders: IEzFormValidationBuilder<IEzFormGroupClientBuilder>[] = [];
  private modelMappers: ((value: any) => any)[] = [];

  constructor(
    private entryName: string,
    private parentBuilder: IEzFormGroupClientBuilder,
    private ezValidationMessageService: EzValidationMessageService
  ) {}

  hasValidator(
    validator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormGroupClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormGroupClientBuilder>(
      this.entryName,
      errorsRaised,
      false,
      [validator],
      this.ezValidationMessageService,
      this.parentBuilder
    );

    this.formValidationBuilders.push(formValidatorBuilder);

    return formValidatorBuilder;
  }

  hasValidators(
    validators: ValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormGroupClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormGroupClientBuilder>(
      this.entryName,
      errorsRaised,
      false,
      validators,
      this.ezValidationMessageService,
      this.parentBuilder
    );

    this.formValidationBuilders.push(formValidatorBuilder);

    return formValidatorBuilder;
  }

  hasAsyncValidator(
    validator: AsyncValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormGroupClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormGroupClientBuilder>(
      this.entryName,
      errorsRaised,
      true,
      [validator],
      this.ezValidationMessageService,
      this.parentBuilder
    );

    this.formValidationBuilders.push(formValidatorBuilder);

    return formValidatorBuilder;
  }

  hasAsyncValidators(
    validators: AsyncValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormGroupClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormGroupClientBuilder>(
      this.entryName,
      errorsRaised,
      true,
      validators,
      this.ezValidationMessageService,
      this.parentBuilder
    );

    this.formValidationBuilders.push(formValidatorBuilder);

    return formValidatorBuilder;
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormGroupOptionClientBuilder {
    this.valueChangesSubscribers.push(valueChangesSubscriber);
    return this;
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormGroupOptionClientBuilder {
    this.statusChangesSubscribers.push(statusChangesSubscriber);
    return this;
  }

  updatesOn(updateOn: UpdateOn): IEzFormGroupOptionClientBuilder {
    this.updateOn = updateOn;
    return this;
  }

  mapsToModel(
    modelInstance: any,
    controlPrefix?: string
  ): IEzFormGroupOptionClientBuilder {
    const callback = (formValue: any) => {
      for (const rawKey in formValue) {
        const key = controlPrefix ? rawKey.replace(controlPrefix, "") : rawKey;

        if (!controlPrefix || rawKey.startsWith(controlPrefix)) {
          if (formValue.hasOwnProperty(rawKey)) {
            if (!modelInstance.hasOwnProperty(key)) continue;

            modelInstance[key] = formValue[rawKey];
          }
        }
      }
    };

    this.modelMappers.push(callback);
    return this;
  }

  and(): IEzFormGroupClientBuilder {
    return this.parentBuilder;
  }

  build(): IEzFormGroupOptions {
    const groupValidationOptions = this.formValidationBuilders.map(
      (formValidationBuilder) => formValidationBuilder.build()
    );

    return {
      entryName: this.entryName,
      updateOn: this.updateOn,
      modelMappers: this.modelMappers,
      validatorOptions: groupValidationOptions,
      statusChangesSubscribers: this.statusChangesSubscribers,
      valueChangesSubscribers: this.valueChangesSubscribers,
    };
  }
}
