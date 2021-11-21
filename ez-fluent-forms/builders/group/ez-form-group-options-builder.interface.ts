import { IEzFormGroupOptions } from "../../types/options/ez-form-group-options.interface";
import {
  IEzBuildProvider,
  IEzParentProvider,
} from "../ez-base-builders.interface";
import { IEzFormEntryOptionClientBuilder } from "../ez-form-entry-options-builder.interface";
import { IEzFormGroupBuilder } from "./ez-form-group-builder.interface";

export type IEzFormGroupOptionBuilder = IEzFormGroupOptionClientBuilder &
  IEzBuildProvider<IEzFormGroupOptions> & {};

export type IEzFormGroupOptionClientBuilder = IEzFormEntryOptionClientBuilder<
  IEzFormGroupBuilder,
  IEzFormGroupOptionClientBuilder
> &
  IEzParentProvider<IEzFormGroupBuilder> & {};
