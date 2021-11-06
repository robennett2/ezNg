import { ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormValidationBuilder } from "../validation/ez-form-validation-builder.interface";
import { EzFormValidationBuilder } from "../validation/ez-form-validation-options-builder";
import { IEzFormGroupBuilder } from "./ez-form-group-builder.interface";
import { IEzFormGroupOptionBuilder } from "./ez-form-group-options-builder.interface";

export class EzFormGroupOptionsBuilder implements IEzFormGroupOptionBuilder {
  private updateOn: UpdateOn = "change";
  private valueChangesSubscribers: ((
    valueChanges$: Observable<any>
  ) => void)[] = [];
  private statusChangesSubscribers: ((
    statusChanges$: Observable<FormStatus>
  ) => void)[] = [];
  private formValidationBuilders: IEzFormValidationBuilder<IEzFormGroupBuilder>[] = [];

  constructor(
    private entryName: string,
    private parentBuilder: IEzFormGroupBuilder,
    private ezValidationMessageService: EzValidationMessageService
  ) {}

  hasValidator(
    validator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormGroupBuilder> {
    const formValidatorBuilder = new EzFormValidationBuilder<IEzFormGroupBuilder>(
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

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormEntryOptionBuilder<IEzFormGroupBuilder> {
    this.valueChangesSubscribers.push(valueChangesSubscriber);
    return this;
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<IEzFormGroupBuilder> {
    this.statusChangesSubscribers.push(statusChangesSubscriber);
    return this;
  }

  updatesOn(
    updateOn: UpdateOn
  ): IEzFormEntryOptionBuilder<IEzFormGroupBuilder> {
    this.updateOn = updateOn;
    return this;
  }

  and(): IEzFormGroupBuilder {
    return this.parentBuilder;
  }

  build(): IEzFormGroupOptions {
    return {
      updateOn: this.updateOn,
      controls: [],
      entryName: "",
      statusChangesSubscribers: [],
      modelMappers: [],
      validatorOptions: [],
      valueChangesSubscribers: [],
    };
  }
}
