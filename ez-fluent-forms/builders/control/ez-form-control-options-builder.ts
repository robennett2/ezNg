import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import { EzFormEntryOptionsBuilder } from "../ez-form-entry-options-builder";
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
import {
  IEzFormControlOptionBuilder,
  IEzFormControlOptionClientBuilder,
} from "./ez-form-control-options-builder.interface";

export class EzFormControlOptionsBuilder
  implements IEzFormControlOptionBuilder {
  private initialValue?: any;
  private ezFormEntryOptionBuilder: EzFormEntryOptionsBuilder<
    IEzFormControlClientBuilder,
    IEzFormControlOptionClientBuilder
  >;

  constructor(
    entryName: string,
    ezValidationMessageService: EzValidationMessageService,
    private parentBuilder: IEzFormControlBuilder
  ) {
    this.ezFormEntryOptionBuilder = new EzFormEntryOptionsBuilder(
      entryName,
      this.parentBuilder,
      this,
      ezValidationMessageService
    );
  }

  private formValidationBuilders: IEzFormValidationBuilder<IEzFormControlClientBuilder>[] = [];

  hasValidator(
    valdator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasValidator(valdator, errorsRaised);
  }

  hasValidators(
    valdators: ValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasValidators(valdators, errorsRaised);
  }

  hasAsyncValidator(
    valdator: AsyncValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasAsyncValidator(
      valdator,
      errorsRaised
    );
  }

  hasAsyncValidators(
    valdators: AsyncValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormControlClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasAsyncValidators(
      valdators,
      errorsRaised
    );
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormControlOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.listensForValueChanges(
      valueChangesSubscriber
    );
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormControlOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.listensForValueChanges(
      statusChangesSubscriber
    );
  }

  updatesOn(updateOn: UpdateOn): IEzFormControlOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.updatesOn(updateOn);
  }

  mapsToModel<TModel>(
    modelMapper: (value: any) => TModel,
    controlPrefix?: string
  ): IEzFormControlOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.mapsToModel(
      modelMapper,
      controlPrefix
    );
  }

  hasInitialValue(value: any): IEzFormControlOptionBuilder {
    this.initialValue = value;
    return this;
  }

  and(): IEzFormControlBuilder {
    return this.parentBuilder;
  }

  build(): IEzFormControlOptions<any> {
    const formEntryOptions = this.ezFormEntryOptionBuilder.build();

    return {
      initialValue: this.initialValue,
      entryName: formEntryOptions.entryName,
      updateOn: formEntryOptions.updateOn,
      modelMappers: formEntryOptions.modelMappers,
      validatorOptions: formEntryOptions.validatorOptions,
      statusChangesSubscribers: formEntryOptions.statusChangesSubscribers,
      valueChangesSubscribers: formEntryOptions.valueChangesSubscribers,
    };
  }
}
