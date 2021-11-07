import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControl,
  AbstractControlOptions,
} from "@angular/forms";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { EzFormControlBuilder } from "../control/ez-form-control-builder";
import { IEzFormControlBuilder } from "../control/ez-form-control-builder.interface";
import { IEzFormGroupBuilder } from "./ez-form-group-builder.interface";
import { EzFormGroupOptionsBuilder } from "./ez-form-group-options-builder";
import { IEzFormGroupOptionBuilder } from "./ez-form-group-options-builder.interface";

export class EzFormGroupBuilder implements IEzFormGroupBuilder {
  private formControlBuilders: {
    [formEntryName: string]: IEzFormControlBuilder;
  } = {};
  private formGroupOptionsBuilder: IEzFormGroupOptionBuilder = new EzFormGroupOptionsBuilder(
    this.entryName,
    this,
    this.ezValidationMessageService
  );

  constructor(
    private entryName: string,
    private formBuilder: FormBuilder,
    private ezValidationMessageService: EzValidationMessageService
  ) {}

  that(): IEzFormGroupOptionBuilder {
    return this.formGroupOptionsBuilder;
  }

  withControl(entryName: string): IEzFormControlBuilder {
    const formControlBuilder = new EzFormControlBuilder(
      this.formBuilder,
      entryName,
      this.ezValidationMessageService,
      this
    );

    this.formControlBuilders[entryName] = formControlBuilder;

    return formControlBuilder;
  }

  build(): FormGroup {
    const formGroupOptions = this.formGroupOptionsBuilder?.build();

    const validators: ValidatorFn[] = [];
    const asyncValidators: AsyncValidatorFn[] = [];

    const formControls: { [formControlName: string]: AbstractControl } = {};
    for (const formEntryName in this.formControlBuilders) {
      if (this.formControlBuilders.hasOwnProperty(formEntryName))
        formControls[formEntryName] = this.formControlBuilders[
          formEntryName
        ].build();
    }

    formGroupOptions?.validatorOptions?.forEach((validatorOption) => {
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
      updateOn: formGroupOptions?.updateOn,
    };

    const group = this.formBuilder.group(formControls, abstractControlOptions);

    formGroupOptions.statusChangesSubscribers.forEach(
      (statusChangesSubscriber) => {
        statusChangesSubscriber(group.statusChanges);
      }
    );

    formGroupOptions.valueChangesSubscribers.forEach(
      (valueChangesSubscriber) => {
        valueChangesSubscriber(group.valueChanges);
      }
    );

    group.valueChanges.subscribe((value: any) => {
      formGroupOptions.modelMappers.forEach((mapper) => mapper(value));
    });

    group.statusChanges.subscribe((statusChange: FormStatus) => {
      if (statusChange === "INVALID" && (group.touched || group.dirty)) {
        formGroupOptions.validatorOptions.forEach((validatorOption) => {
          validatorOption.errorNames.forEach((errorName) => {
            if (group.hasError(errorName)) {
              this.ezValidationMessageService.raiseMessage({
                forEntry: this.entryName,
                errorName: errorName,
                validationMessage: {
                  errorNames: validatorOption.errorNames,
                  message: validatorOption.message,
                  componentType: validatorOption.componentType,
                },
              });
            }
          });
        });
      }

      formGroupOptions.validatorOptions.forEach((validatorOption) => {
        validatorOption.errorNames.forEach((errorName) => {
          if (!group.hasError(errorName)) {
            this.ezValidationMessageService.unraiseMessage({
              forEntry: this.entryName,
              errorName: errorName,
              validationMessage: null,
            });
          }
        });
      });
    });

    return group;
  }
}
