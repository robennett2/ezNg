import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import {
  IEzOptionsProvider,
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import {
  IEzFormValidationOptionsBuilder,
  IEzFormValidationOptionsClientBuilder,
} from "./ez-form-validation-options-builder.interface";

export type IEzFormValidationBuilder<
  TParentBuilder
> = IEzFormValidationClientBuilder<TParentBuilder> &
  IEzBuildProvider<IEzValidationOptions> & {};

export type IEzFormValidationClientBuilder<TParentBuilder> = IEzOptionsProvider<
  IEzFormValidationOptionsClientBuilder<
    IEzFormValidationClientBuilder<TParentBuilder>
  >
> &
  IEzParentProvider<TParentBuilder> & {};
