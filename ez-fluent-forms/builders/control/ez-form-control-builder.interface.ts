import { AbstractControl } from "@angular/forms";
import {
  IEzOptionsProvider,
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormGroupBuilder } from "../group/ez-form-group-builder.interface";
import { IEzFormControlOptionBuilder } from "./ez-form-control-options-builder.interface";

export type IEzFormControlBuilder = IEzOptionsProvider<IEzFormControlOptionBuilder> &
  IEzBuildProvider<AbstractControl> &
  IEzParentProvider<IEzFormGroupBuilder> & {};
