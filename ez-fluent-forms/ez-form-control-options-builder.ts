import EzOptionsBuilderBase from "./base/ez-options-builder-base";
import EzFormGroupBuilder from "./ez-form-group-builder";
import { IEzFormControlOptionBuilder } from "./interfaces/ez-form-control-option-builder.interface";

export default class EzFormControlOptionsBuilder<
  TValue
> extends EzOptionsBuilderBase<
  IEzFormControlOptionBuilder<TValue>,
  EzFormGroupBuilder,
  TValue
> {
  private _initialValue: TValue | null = null;
  get initialValue(): TValue | null {
    return this._initialValue;
  }

  hasInitialValue(
    initialValue: TValue | null
  ): EzFormControlOptionsBuilder<TValue> {
    this._initialValue = initialValue;
    return this;
  }
}
