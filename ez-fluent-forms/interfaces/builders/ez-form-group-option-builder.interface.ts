import EzFormGroupBuilder from "../../ez-form-group-builder";
import { IEzOptionBuilderBase } from "./ez-option-builder-base.interface";

export type IEzFormGroupOptionBuilder<TValue = any> = IEzOptionBuilderBase<
  IEzFormGroupOptionBuilder<TValue>,
  EzFormGroupBuilder,
  TValue
> & {
  mapsToModel(
    modelInstance: any,
    controlPrefix?: string
  ): IEzFormGroupOptionBuilder;
};
