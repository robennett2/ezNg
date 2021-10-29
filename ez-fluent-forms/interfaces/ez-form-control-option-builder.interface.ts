import EzFormGroupBuilder from "../ez-form-group-builder";
import { IEzOptionBuilderBase } from "./ez-option-builder-base.interface";

export type IEzFormControlOptionBuilder<TValue = any> = IEzOptionBuilderBase<
  IEzFormControlOptionBuilder<TValue>,
  EzFormGroupBuilder,
  TValue
> & {
  hasInitialValue(
    initialValue: TValue | null
  ): IEzFormControlOptionBuilder<TValue>;
};
