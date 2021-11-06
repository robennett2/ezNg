import { Type } from "@angular/core";
import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import {
  IEzParentProvider,
  IEzBuildProvider,
} from "../ez-base-builders.interface";

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
