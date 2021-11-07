import { UpdateOn } from "../form/update-on.type";
import { IEzFormEntryOptions } from "./ez-form-entry-options.interface";

export type IEzFormGroupOptions = IEzFormEntryOptions & {
  modelMappers: ((value: any) => any)[];
  updateOn: UpdateOn;
};
