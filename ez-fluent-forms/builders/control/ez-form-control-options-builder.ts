import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { EzFormValidationBuilder } from "../validation/ez-form-validation-builder";
import {
  IEzFormValidationBuilder,
  IEzFormValidationClientBuilder,
} from "../validation/ez-form-validation-builder.interface";
import {
  IEzFormControlBuilder,
  IEzFormControlClientBuilder,
} from "./ez-form-control-builder.interface";
import { IEzFormControlOptionBuilder } from "./ez-form-control-options-builder.interface";

export class EzFormControlOptionsBuilder
  implements IEzFormControlOptionBuilder {
  private initialValue?: any;
  private valueChangesSubscribers: ((
    valueChanges$: Observable<any>
  ) => void)[] = [];
  private statusChangesSubscribers: ((
    statusChanges$: Observable<FormStatus>
  ) => void)[] = [];
  private updateOn: UpdateOn = "change";
  private modelMappers: ((value: any) => any)[] = [];

  constructor(
    private entryName: string,
    private ezValidationMessageService: EzValidationMessageService,
    private parentBuilder: IEzFormControlBuilder
  ) {}

  private formValidationBuilders: IEzFormValidationBuilder<IEzFormControlClientBuilder>[] = [];

  updatesOn(
    updateOn: UpdateOn
  ): IEzFormEntryOptionBuilder<IEzFormControlClientBuilder> {
    this.updateOn = updateOn;
    return this;
  }

  hasValidator(
    validator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormControlBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormControlBuilder>(
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
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormControlClientBuilder>(
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
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormControlClientBuilder>(
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
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormControlClientBuilder>(
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

  hasInitialValue(value: any): IEzFormControlOptionBuilder {
    this.initialValue = value;
    return this;
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormEntryOptionBuilder<IEzFormControlClientBuilder> {
    this.valueChangesSubscribers.push(valueChangesSubscriber);
    return this;
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<IEzFormControlClientBuilder> {
    this.statusChangesSubscribers.push(statusChangesSubscriber);
    return this;
  }

  mapsToModel<TModel>(
    modelMapper: (value: any) => TModel
  ): IEzFormEntryOptionBuilder<IEzFormControlClientBuilder> {
    this.modelMappers.push(modelMapper);
    return this;
  }

  and(): IEzFormControlBuilder {
    return this.parentBuilder;
  }

  build(): IEzFormControlOptions<any> {
    const controlValidationOptions = this.formValidationBuilders.map(
      (formValidationBuilder) => formValidationBuilder.build()
    );

    return {
      entryName: this.entryName,
      initialValue: this.initialValue,
      updateOn: this.updateOn,
      validatorOptions: controlValidationOptions,
      valueChangesSubscribers: this.valueChangesSubscribers,
      statusChangesSubscribers: this.statusChangesSubscribers,
      modelMappers: this.modelMappers,
    };
  }
}
