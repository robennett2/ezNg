import { ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormValidationBuilder } from "../validation/ez-form-validation-builder.interface";
import { EzFormValidationBuilder } from "../validation/ez-form-validation-options-builder";
import { IEzFormControlBuilder } from "./ez-form-control-builder.interface";
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

  constructor(
    private entryName: string,
    private ezValidationMessageService: EzValidationMessageService,
    private parentBuilder: IEzFormControlBuilder
  ) {}

  private formValidationBuilders: IEzFormValidationBuilder<IEzFormControlBuilder>[] = [];

  updatesOn(
    updateOn: UpdateOn
  ): IEzFormEntryOptionBuilder<IEzFormControlBuilder> {
    this.updateOn = updateOn;
    return this;
  }

  hasValidator(
    validator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormControlBuilder> {
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

  hasInitialValue(value: any): IEzFormControlOptionBuilder {
    this.initialValue = value;
    return this;
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormEntryOptionBuilder<IEzFormControlBuilder> {
    this.valueChangesSubscribers.push(valueChangesSubscriber);
    return this;
  }

  listensForStatusChanges(
    statusChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<IEzFormControlBuilder> {
    this.statusChangesSubscribers.push(statusChangesSubscriber);
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
      statusChangesSubscribers: this.statusChangesSubscribers,
      validatorOptions: controlValidationOptions,
      valueChangesSubscribers: this.valueChangesSubscribers,
      updateOn: this.updateOn,
    };
  }
}
