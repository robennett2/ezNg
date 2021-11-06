import { UpdateOn } from "../form/update-on.type";
import { IEzFormControlOptions } from "./ez-form-control-options.interface";
import { IEzFormEntryOptions } from "./ez-form-entry-options.interface";

export type IEzFormGroupOptions = IEzFormEntryOptions & {
  controls: IEzFormControlOptions[];
  modelMappers: ((value: any) => any)[];
  updateOn: UpdateOn;
};
