import { IEzFormEntryOptions } from "./ez-form-entry-options.interface";

export type IEzFormControlOptions<TValue = any> = IEzFormEntryOptions & {
  initialValue: TValue;
};
