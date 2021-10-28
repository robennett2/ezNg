import { FormBuilder, FormGroup } from "@angular/forms";
import EzFormBuilderBase from "./base/ez-form-builder-base";
import EzFormControlBuilder from "./ez-form-control-builder";
import IBuilder from "./interfaces/builder.interface";
import { IFormControlBuilder } from "./interfaces/form-control-builder.interface";

export default class EzFormGroupBuilder
  extends EzFormBuilderBase<EzFormGroupBuilder, any>
  implements IBuilder<FormGroup> {
  private formControlBuilders: IFormControlBuilder[] = [];

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  withControl<TValue>(controlName: string): EzFormControlBuilder<TValue> {
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

    const group = this.formBuilder.group(controls, this.abstractControlOptions);

    if (!!this.onValueChangesCallback) {
      this.onValueChangesCallback(group.valueChanges);
    }

    if (!!this.onStatusChangesCallback) {
      this.onStatusChangesCallback(group.statusChanges);
    }

    return group;
  }
}
