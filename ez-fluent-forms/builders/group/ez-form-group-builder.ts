import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidatorFn,
} from "@angular/forms";
import { Observable } from "rxjs";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import { EzFormControlBuilder } from "../control/ez-form-control-builder";
import { IEzFormControlBuilder } from "../control/ez-form-control-builder.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { EzFormValidationBuilder } from "../validation/ez-form-validation-builder";
import { IEzFormValidationBuilder } from "../validation/ez-form-validation-builder.interface";
import {
  IEzFormGroupBuilder,
  IEzFormGroupOptionBuilder,
} from "./ez-form-group-builder.interface";

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

    group.statusChanges.subscribe((statusChange: FormStatus) => {
      if (statusChange === "INVALID" && (group.touched || group.dirty)) {
        formGroupOptions.validatorOptions.forEach((validatorOption) => {
          validatorOption.errorNames.forEach((errorName) => {
            if (group.hasError(errorName)) {
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
