import { FormGroup } from "@angular/forms";
import { IEzFormControlBuilder } from "../control/ez-form-control-builder.interface";
import {
  IEzBuildProvider,
  IEzOptionsProvider,
} from "../ez-base-builders.interface";
import { IEzFormGroupOptionBuilder } from "./ez-form-group-options-builder.interface";

export type IEzFormGroupBuilder = IEzOptionsProvider<IEzFormGroupOptionBuilder> &
  IEzBuildProvider<FormGroup> & {
    withControl(entryName: string): IEzFormControlBuilder;
  };
