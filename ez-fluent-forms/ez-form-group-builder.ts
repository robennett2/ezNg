import { FormBuilder, FormGroup } from "@angular/forms";
import EzOptionsBuilderBase from "./base/ez-options-builder-base";
import EzFormControlBuilder from "./ez-form-control-builder";
import IBuilder from "./interfaces/builder.interface";
import { IFormControlBuilder } from "./interfaces/form-control-builder.interface";
import EzFormGroupOptionsBuilder from "./ez-form-group-options-builder";
import { IEzOptionBuilderBase } from "./interfaces/ez-option-builder-base.interface";
import { IEzFormGroupOptionBuilder } from "./interfaces/ez-form-group-option-builder.interface";

export default class EzFormGroupBuilder implements IBuilder<FormGroup> {
  private formControlBuilders: IFormControlBuilder[] = [];
  private optionsBuilder: EzFormGroupOptionsBuilder = new EzFormGroupOptionsBuilder(
    this
  );

  constructor(private formBuilder: FormBuilder) {}

  that(): IEzOptionBuilderBase<IEzFormGroupOptionBuilder, EzFormGroupBuilder> {
    return this.optionsBuilder;
  }

  withControl<TValue = any>(controlName: string): EzFormControlBuilder<TValue> {
    const controlBuilder = new EzFormControlBuilder<TValue>(
      controlName,
      this,
      this.formBuilder
    );

    this.formControlBuilders.push(controlBuilder);

    return controlBuilder;
  }

  build(): FormGroup {
    const controls: { [key: string]: any } = {};
    for (const controlBuilder of this.formControlBuilders) {
      controls[controlBuilder.controlName] = controlBuilder.build();
    }

    const group = this.formBuilder.group(
      controls,
      this.optionsBuilder.abstractControlOptions
    );

    if (!!this.optionsBuilder?.onValueChangesCallback) {
      this.optionsBuilder.onValueChangesCallback(group.valueChanges);
    }

    if (!!this.optionsBuilder?.onStatusChangesCallback) {
      this.optionsBuilder.onStatusChangesCallback(group.statusChanges);
    }

    return group;
  }
}
