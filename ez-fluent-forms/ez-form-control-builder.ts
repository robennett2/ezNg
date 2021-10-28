import { FormBuilder, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import EzFormBuilderBase from "./base/ez-form-builder-base";
import EzFormGroupBuilder from "./ez-form-group-builder";
import { IFormControlBuilder } from "./interfaces/form-control-builder.interface";
import { FormStatus } from "./types/form-status.type";

export default class EzFormControlBuilder<TValue>
  extends EzFormBuilderBase<EzFormControlBuilder<TValue>, TValue>
  implements IFormControlBuilder {
  private initialValue: TValue | null = null;

  constructor(
    private _controlName: string,
    private formGroupBuilder: EzFormGroupBuilder,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  public get controlName(): string {
    return this._controlName;
  }

  hasInitialValue(initialValue: TValue): EzFormControlBuilder<TValue> {
    this.initialValue = initialValue;
    return this;
  }

  and(): EzFormGroupBuilder {
    return this.formGroupBuilder;
  }

  build(): FormControl {
    const control = this.formBuilder.control(
      this.initialValue,
      this.abstractControlOptions
    );

    if (!!this.onValueChangesCallback) {
      this.onValueChangesCallback(control.valueChanges);
    }

    if (!!this.onStatusChangesCallback) {
      this.onStatusChangesCallback(control.statusChanges);
    }

    return control;
  }
}
