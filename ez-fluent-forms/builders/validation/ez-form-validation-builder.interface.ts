import { Type } from "@angular/core";
import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import {
  IEzOptionsProvider,
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";

// VALIDATION
export type IEzFormValidationBuilder<TParentBuilder> = IEzOptionsProvider<
  IEzFormValidationOptionsBuilder<IEzFormValidationBuilder<TParentBuilder>>
> &
  IEzBuildProvider<IEzValidationOptions> &
  IEzParentProvider<TParentBuilder> & {};

export type IEzFormValidationOptionsBuilder<
  TParentBuilder
> = IEzParentProvider<TParentBuilder> &
  IEzBuildProvider<IEzValidationOptions> & {
    showsMessage(
      message: string
    ): IEzFormValidationOptionsBuilder<TParentBuilder>;
    usesComponent(
      componentType: Type<any>
    ): IEzFormValidationOptionsBuilder<TParentBuilder>;
  };
