import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../services/ez-validation-message.service";
import { FormStatus } from "../types/form/form-status.type";
import { UpdateOn } from "../types/form/update-on.type";
import { IEzFormEntryOptions } from "../types/options/ez-form-entry-options.interface";
import { IEzFormEntryOptionBuilder } from "./ez-form-entry-options-builder.interface";
import { EzFormValidationBuilder } from "./validation/ez-form-validation-builder";
import {
  IEzFormValidationBuilder,
  IEzFormValidationClientBuilder,
} from "./validation/ez-form-validation-builder.interface";

export class EzFormEntryOptionsBuilder<TParentBuilder>
  implements IEzFormEntryOptionBuilder<TParentBuilder> {
  private updateOn: UpdateOn = "change";
  private valueChangesSubscribers: ((
    valueChanges$: Observable<any>
  ) => void)[] = [];
  private statusChangesSubscribers: ((
    statusChanges$: Observable<FormStatus>
  ) => void)[] = [];
  private formValidationBuilders: IEzFormValidationBuilder<TParentBuilder>[] = [];
  private modelMappers: ((value: any) => any)[] = [];

  constructor(
    private entryName: string,
    private parentBuilder: TParentBuilder,
    private ezValidationMessageService: EzValidationMessageService
  ) {}

  build(): IEzFormEntryOptions {
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

  hasValidator(
    validator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<TParentBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<TParentBuilder>(
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
  ): IEzFormValidationClientBuilder<TParentBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<TParentBuilder>(
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
  ): IEzFormValidationClientBuilder<TParentBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<TParentBuilder>(
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
  ): IEzFormValidationClientBuilder<TParentBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<TParentBuilder>(
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
  ): IEzFormEntryOptionBuilder<TParentBuilder> {
    this.valueChangesSubscribers.push(valueChangesSubscriber);
    return this;
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<TParentBuilder> {
    this.statusChangesSubscribers.push(statusChangesSubscriber);
    return this;
  }

  updatesOn(updateOn: UpdateOn): IEzFormEntryOptionBuilder<TParentBuilder> {
    this.updateOn = updateOn;
    return this;
  }

  mapsToModel(
    modelInstance: any,
    controlPrefix?: string
  ): IEzFormEntryOptionBuilder<TParentBuilder> {
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
}
