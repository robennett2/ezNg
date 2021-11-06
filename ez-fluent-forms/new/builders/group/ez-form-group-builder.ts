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
    this
  );

  constructor(
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
    return group;
  }
}

export class EzFormGroupOptionsBuilder implements IEzFormGroupOptionBuilder {
  private updateOn: UpdateOn = "change";

  constructor(private parentBuilder: IEzFormGroupBuilder) {}

  hasValidator(
    valdator: ValidatorFn,
    errorsRaised: string[]
  ): IEzFormValidationBuilder<IEzFormGroupBuilder> {
    throw new Error("Method not implemented.");
  }

  listensForValueChanges(
    valueChangesSubscriber: (valueChanges$: Observable<any>) => void
  ): IEzFormEntryOptionBuilder<IEzFormGroupBuilder> {
    throw new Error("Method not implemented.");
  }

  listensForStatusChanges(
    valueChangesSubscriber: (statusChanges$: Observable<FormStatus>) => void
  ): IEzFormEntryOptionBuilder<IEzFormGroupBuilder> {
    throw new Error("Method not implemented.");
  }

  updatesOn(updateOn: UpdateOn): IEzFormGroupOptionBuilder {
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
