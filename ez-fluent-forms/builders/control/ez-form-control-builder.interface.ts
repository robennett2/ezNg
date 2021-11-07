import { AbstractControl } from "@angular/forms";
import {
  IEzOptionsProvider,
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormGroupBuilder } from "../group/ez-form-group-builder.interface";
import { IEzFormControlOptionClientBuilder } from "./ez-form-control-options-builder.interface";

export type IEzFormControlBuilder = IEzFormControlClientBuilder &
  IEzBuildProvider<AbstractControl> &
  IEzParentProvider<IEzFormGroupBuilder> & {};

export type IEzFormControlClientBuilder = IEzOptionsProvider<IEzFormControlOptionClientBuilder> &
  IEzParentProvider<IEzFormGroupBuilder> & {};
