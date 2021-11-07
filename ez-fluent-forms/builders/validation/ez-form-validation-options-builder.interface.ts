import { Type } from "@angular/core";
import { IEzValidationOptions } from "../../types/options/ez-validation-options.interface";
import {
  IEzParentProvider,
  IEzBuildProvider,
} from "../ez-base-builders.interface";

export type IEzFormValidationOptionsBuilder<
  TParentBuilder
> = IEzFormValidationOptionsClientBuilder<TParentBuilder> &
  IEzBuildProvider<IEzValidationOptions> & {};

export type IEzFormValidationOptionsClientBuilder<
  TParentBuilder
> = IEzParentProvider<TParentBuilder> & {
  showsMessage(
    message: string
  ): IEzFormValidationOptionsClientBuilder<TParentBuilder>;
  usesComponent(
    componentType: Type<any>
  ): IEzFormValidationOptionsClientBuilder<TParentBuilder>;
};
