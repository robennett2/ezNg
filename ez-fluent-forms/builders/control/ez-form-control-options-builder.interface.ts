import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import {
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormControlBuilder } from "./ez-form-control-builder.interface";

export type IEzFormControlOptionBuilder = IEzFormEntryOptionBuilder<IEzFormControlBuilder> &
  IEzBuildProvider<IEzFormControlOptions> &
  IEzParentProvider<IEzFormControlBuilder> & {
    hasInitialValue(value: any): IEzFormControlOptionBuilder;
  };
