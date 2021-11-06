import { FormBuilder, FormGroup } from "@angular/forms";
import EzOptionsBuilderBase from "./base/ez-options-builder-base";
import EzFormControlBuilder from "./ez-form-control-builder";
import IBuilder from "./interfaces/builders/builder.interface";
import EzFormGroupOptionsBuilder from "./ez-form-group-options-builder";
import { IEzFormGroupOptionBuilder } from "./interfaces/builders/ez-form-group-option-builder.interface";
import { IFormControlBuilder } from "./interfaces/builders/form-control-builder.interface";

export default class EzFormGroupBuilder implements IBuilder<FormGroup> {
  private formControlBuilders: IFormControlBuilder[] = [];
  private optionsBuilder: EzFormGroupOptionsBuilder = new EzFormGroupOptionsBuilder(
    this
  );

  constructor(private formBuilder: FormBuilder) {}

  that(): IEzFormGroupOptionBuilder {
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

    if (this.optionsBuilder.mapToModelCallbacks.length > 0) {
      group.valueChanges.subscribe(() => {
        this.optionsBuilder.mapToModelCallbacks.forEach((callback) =>
          callback(group.value)
        );
      });
    }

    if (!!this.optionsBuilder?.onValueChangesCallback) {
      this.optionsBuilder.onValueChangesCallback(group.valueChanges);
    }

    if (!!this.optionsBuilder?.onStatusChangesCallback) {
      this.optionsBuilder.onStatusChangesCallback(group.statusChanges);
    }

    return group;
  }
}
