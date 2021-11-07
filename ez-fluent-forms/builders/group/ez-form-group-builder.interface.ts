import { FormGroup } from "@angular/forms";
import {
  IEzFormControlBuilder,
  IEzFormControlClientBuilder,
} from "../control/ez-form-control-builder.interface";
import {
  IEzBuildProvider,
  IEzOptionsProvider,
} from "../ez-base-builders.interface";
import { IEzFormGroupOptionClientBuilder } from "./ez-form-group-options-builder.interface";

export type IEzFormGroupBuilder = IEzFormGroupClientBuilder &
  IEzBuildProvider<FormGroup> & {};

export type IEzFormGroupClientBuilder = IEzOptionsProvider<IEzFormGroupOptionClientBuilder> & {
  withControl(entryName: string): IEzFormControlClientBuilder;
};
