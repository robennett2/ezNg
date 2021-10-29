import EzOptionsBuilderBase from "./base/ez-options-builder-base";
import EzFormGroupBuilder from "./ez-form-group-builder";
import { IEzFormGroupOptionBuilder } from "./interfaces/ez-form-group-option-builder.interface";

export default class EzFormGroupOptionsBuilder extends EzOptionsBuilderBase<
  IEzFormGroupOptionBuilder,
  EzFormGroupBuilder,
  any
> {}
