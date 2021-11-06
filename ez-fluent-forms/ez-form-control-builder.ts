import { FormBuilder, FormControl } from "@angular/forms";
import EzFormControlOptionsBuilder from "./ez-form-control-options-builder";
import EzFormGroupBuilder from "./ez-form-group-builder";
import { IEzFormControlOptionBuilder } from "./interfaces/builders/ez-form-control-option-builder.interface";
import { IFormControlBuilder } from "./interfaces/builders/form-control-builder.interface";

export default class EzFormControlBuilder<TValue>
  implements IFormControlBuilder {
  private optionsBuilder: EzFormControlOptionsBuilder<TValue>;

  constructor(
    private _controlName: string,
    private formGroupBuilder: EzFormGroupBuilder,
    private formBuilder: FormBuilder
  ) {
    this.optionsBuilder = new EzFormControlOptionsBuilder<TValue>(
      this.formGroupBuilder
    );
  }

  public get controlName(): string {
    return this._controlName;
  }

  that(): IEzFormControlOptionBuilder<TValue> {
    return this.optionsBuilder;
  }

  build(): FormControl {
    const control = this.formBuilder.control(
      this.optionsBuilder?.initialValue,
      this.optionsBuilder?.abstractControlOptions
    );

    if (!!this.optionsBuilder?.onValueChangesCallback) {
      this.optionsBuilder.onValueChangesCallback(control.valueChanges);
    }

    if (!!this.optionsBuilder?.onStatusChangesCallback) {
      this.optionsBuilder.onStatusChangesCallback(control.statusChanges);
    }

    return control;
  }
}
