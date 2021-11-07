import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import {
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormControlClientBuilder } from "./ez-form-control-builder.interface";

export type IEzFormControlOptionBuilder = IEzFormControlOptionClientBuilder &
  IEzBuildProvider<IEzFormControlOptions> & {};

export type IEzFormControlOptionClientBuilder = IEzFormEntryOptionBuilder<IEzFormControlClientBuilder> &
  IEzParentProvider<IEzFormControlClientBuilder> & {
    hasInitialValue(value: any): IEzFormControlOptionBuilder;
  };
