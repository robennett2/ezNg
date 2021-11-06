import { FormGroup, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormStatus } from "../../types/form/form-status.type";
import { UpdateOn } from "../../types/form/update-on.type";
import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import { IEzFormControlBuilder } from "../control/ez-form-control-builder.interface";
import {
  IEzBuildProvider,
  IEzOptionsProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormEntryOptionBuilder } from "../ez-form-entry-options-builder.interface";

// GROUP
export type IEzFormGroupBuilder = IEzOptionsProvider<IEzFormGroupOptionBuilder> &
  IEzBuildProvider<FormGroup> & {
    withControl(entryName: string): IEzFormControlBuilder;
  };

export type IEzFormGroupOptionBuilder = IEzFormEntryOptionBuilder<IEzFormGroupBuilder> &
  IEzBuildProvider<IEzFormGroupOptions> &
  IEzParentProvider<IEzFormGroupBuilder> & {
    updatesOn(updateOn: UpdateOn): IEzFormGroupOptionBuilder;
  };
