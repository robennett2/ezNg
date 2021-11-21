import { ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import { EzFormEntryOptionsBuilder } from "../ez-form-entry-options-builder";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormValidationClientBuilder } from "../validation/ez-form-validation-builder.interface";
import {
  IEzFormGroupBuilder,
  IEzFormGroupClientBuilder,
} from "./ez-form-group-builder.interface";
import {
  IEzFormGroupOptionBuilder,
  IEzFormGroupOptionClientBuilder,
} from "./ez-form-group-options-builder.interface";

export class EzFormGroupOptionsBuilder implements IEzFormGroupOptionBuilder {
  private ezFormEntryOptionBuilder: EzFormEntryOptionsBuilder<
    IEzFormGroupBuilder,
    IEzFormGroupOptionClientBuilder
  >;

  constructor(
    entryName: string,
    private parentBuilder: IEzFormGroupBuilder,
    ezValidationMessageService: EzValidationMessageService
  ) {
    this.ezFormEntryOptionBuilder = new EzFormEntryOptionsBuilder(
      entryName,
      this.parentBuilder,
      this,
      ezValidationMessageService
    );
  }

  hasValidator(
    valdator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupBuilder> {
    return this.ezFormEntryOptionBuilder.hasValidator(valdator, errorsRaised);
  }

  hasValidators(
    valdators: ValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupBuilder> {
    return this.ezFormEntryOptionBuilder.hasValidators(valdators, errorsRaised);
  }

  hasAsyncValidator(
    valdator: AsyncValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupBuilder> {
    return this.ezFormEntryOptionBuilder.hasAsyncValidator(
      valdator,
      errorsRaised
    );
  }

  hasAsyncValidators(
    valdators: AsyncValidatorFn[],
    errorsRaised: string[]
  ): IEzFormValidationClientBuilder<IEzFormGroupBuilder> {
    return this.ezFormEntryOptionBuilder.hasAsyncValidators(
      valdators,
      errorsRaised
    );
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormGroupOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.listensForValueChanges(
      valueChangesSubscriber
    );
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormGroupOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.listensForValueChanges(
      statusChangesSubscriber
    );
  }

  mapsToModel<TModel>(
    modelMapper: (value: any) => TModel,
    controlPrefix?: string
  ): IEzFormGroupOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.mapsToModel(
      modelMapper,
      controlPrefix
    );
  }

  updatesOn(updateOn: UpdateOn): IEzFormGroupOptionClientBuilder {
    return this.ezFormEntryOptionBuilder.updatesOn(updateOn);
  }

  and(): IEzFormGroupBuilder {
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
