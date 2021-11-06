import {
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControlOptions,
} from "@angular/forms";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { IEzFormGroupBuilder } from "../group/ez-form-group-builder.interface";
import { IEzFormControlBuilder } from "./ez-form-control-builder.interface";
import { EzFormControlOptionsBuilder } from "./ez-form-control-options-builder";
import { IEzFormControlOptionBuilder } from "./ez-form-control-options-builder.interface";

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
