import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import {
  IEzOptionsProvider,
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormValidationOptionsBuilder } from "./ez-form-validation-options-builder.interface";

export type IEzFormValidationBuilder<TParentBuilder> = IEzOptionsProvider<
  IEzFormValidationOptionsBuilder<IEzFormValidationBuilder<TParentBuilder>>
> &
  IEzBuildProvider<IEzValidationOptions> &
  IEzParentProvider<TParentBuilder> & {};
