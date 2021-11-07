import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import { EzFormEntryOptionsBuilder } from "../ez-form-entry-options-builder";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormValidationClientBuilder } from "../validation/ez-form-validation-builder.interface";
import { IEzFormGroupClientBuilder } from "./ez-form-group-builder.interface";
import {
  IEzFormGroupOptionBuilder,
  IEzFormGroupOptionClientBuilder,
} from "./ez-form-group-options-builder.interface";

export class EzFormGroupOptionsBuilder implements IEzFormGroupOptionBuilder {
  private ezFormEntryOptionBuilder: EzFormEntryOptionsBuilder<IEzFormGroupClientBuilder>;

  constructor(
    entryName: string,
    private parentBuilder: IEzFormGroupClientBuilder,
    ezValidationMessageService: EzValidationMessageService
  ) {
    this.ezFormEntryOptionBuilder = new EzFormEntryOptionsBuilder(
      entryName,
      this.parentBuilder,
      ezValidationMessageService
    );
  }

  hasValidator(
    valdator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasValidator(valdator, errorsRaised);
  }

  hasValidators(
    valdators: ValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasValidators(valdators, errorsRaised);
  }

  hasAsyncValidator(
    valdator: AsyncValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasAsyncValidator(
      valdator,
      errorsRaised
    );
  }

  hasAsyncValidators(
    valdators: AsyncValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupClientBuilder> {
    return this.ezFormEntryOptionBuilder.hasAsyncValidators(
      valdators,
      errorsRaised
    );
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormGroupOptionClientBuilder {
    this.ezFormEntryOptionBuilder.listensForValueChanges(
      valueChangesSubscriber
    );
    return (this as unknown) as IEzFormGroupOptionClientBuilder;
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormGroupOptionClientBuilder {
    this.ezFormEntryOptionBuilder.listensForValueChanges(
      statusChangesSubscriber
    );
    return (this as unknown) as IEzFormGroupOptionClientBuilder;
  }

  mapsToModel<TModel>(
    modelMapper: (value: any) => TModel
  ): IEzFormGroupOptionClientBuilder {
    this.ezFormEntryOptionBuilder.mapsToModel(modelMapper);
    return (this as unknown) as IEzFormGroupOptionClientBuilder;
  }

  updatesOn(
    updateOn: UpdateOn
  ): IEzFormEntryOptionBuilder<IEzFormGroupClientBuilder> {
    this.ezFormEntryOptionBuilder.updatesOn(updateOn);
    return this;
  }

  and(): IEzFormGroupClientBuilder {
    return this.parentBuilder;
  }

  build(): IEzFormGroupOptions {
    const formEntryOptions = this.ezFormEntryOptionBuilder.build();

    return {
      entryName: formEntryOptions.entryName,
      updateOn: formEntryOptions.updateOn,
      modelMappers: formEntryOptions.modelMappers,
      validatorOptions: formEntryOptions.validatorOptions,
      statusChangesSubscribers: formEntryOptions.statusChangesSubscribers,
      valueChangesSubscribers: formEntryOptions.valueChangesSubscribers,
    };
  }
}
