import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormBuilder,
  ValidatorFn,
} from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import {
  IEzFormGroupBuilder,
  IEzFormGroupOptionBuilder,
} from "../group/ez-form-group-builder.interface";
import { EzFormValidationBuilder } from "../validation/ez-form-validation-builder";
import { IEzFormValidationBuilder } from "../validation/ez-form-validation-builder.interface";
import {
  IEzFormControlBuilder,
  IEzFormControlOptionBuilder,
} from "./ez-form-control-builder.interface";

export class EzFormControlBuilder implements IEzFormControlBuilder {
  private formControlOptionsBuilder: EzFormControlOptionsBuilder = new EzFormControlOptionsBuilder(
    this.entryName,
    this.ezValidationMessageService,
    this
  );
  constructor(
    private formBuilder: FormBuilder,
    private entryName: string,
    private ezValidationMessageService: EzValidationMessageService,
    private parentBuilder: IEzFormGroupBuilder
  ) {}

  that(): IEzFormControlOptionBuilder {
    return this.formControlOptionsBuilder;
  }

  and(): IEzFormGroupBuilder {
    return this.parentBuilder;
  }

  build(): AbstractControl {
    const formControlOptions = this.formControlOptionsBuilder?.build();

    const validators: ValidatorFn[] = [];
    const asyncValidators: AsyncValidatorFn[] = [];

    formControlOptions?.validatorOptions?.forEach((validatorOption) => {
      if (validatorOption.isAsync) {
        asyncValidators.push(
          ...(validatorOption.validatorFns as AsyncValidatorFn[])
        );
      } else {
        validators.push(...(validatorOption.validatorFns as ValidatorFn[]));
      }
    });

    const abstractControlOptions: AbstractControlOptions = {
      validators: validators,
      asyncValidators: asyncValidators,
      updateOn: formControlOptions?.updateOn ?? "change", // TODO: move to base and get from options
    };

    const control = this.formBuilder.control(
      formControlOptions?.initialValue,
      abstractControlOptions
    );

    formControlOptions.statusChangesSubscribers.forEach(
      (statusChangesSubscriber) => {
        statusChangesSubscriber(control.statusChanges);
      }
    );

    formControlOptions.valueChangesSubscribers.forEach(
      (valueChangesSubscriber) => {
        valueChangesSubscriber(control.valueChanges);
      }
    );

    control.statusChanges.subscribe((statusChange: FormStatus) => {
      if (statusChange === "INVALID" && (control.touched || control.dirty)) {
        formControlOptions.validatorOptions.forEach((validatorOption) => {
          validatorOption.errorNames.forEach((errorName) => {
            if (control.hasError(errorName)) {
              this.ezValidationMessageService.raiseMessage({
                forEntry: this.entryName,
                errorName: errorName,
                validationMessage: {
                  message: validatorOption.message,
                  componentType: validatorOption.componentType,
                },
              });
            }
          });
        });
      }

      formControlOptions.validatorOptions.forEach((validatorOption) => {
        validatorOption.errorNames.forEach((errorName) => {
          if (!control.hasError(errorName)) {
            this.ezValidationMessageService.unraiseMessage({
              forEntry: this.entryName,
              errorName: errorName,
              validationMessage: null,
            });
          }
        });
      });
    });

    return control;
  }
}

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
