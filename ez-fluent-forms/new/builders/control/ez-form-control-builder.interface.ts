import { AbstractControl } from "@angular/forms";
import { IEzFormControlOptions } from "../../types/options/ez-form-control-options.interface";
import {
  IEzOptionsProvider,
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormGroupBuilder } from "../group/ez-form-group-builder.interface";

export type IEzFormControlBuilder = IEzOptionsProvider<IEzFormControlOptionBuilder> &
  IEzBuildProvider<AbstractControl> &
  IEzParentProvider<IEzFormGroupBuilder> & {};

export type IEzFormControlOptionBuilder = IEzFormEntryOptionBuilder<IEzFormControlBuilder> &
  IEzBuildProvider<IEzFormControlOptions> &
  IEzParentProvider<IEzFormControlBuilder> & {
    hasInitialValue(value: any): IEzFormControlOptionBuilder;
  };
