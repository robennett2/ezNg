import { Observable } from "rxjs";
import { FormStatus } from "../form/form-status.type";
import { UpdateOn } from "../form/update-on.type";
import { IEzValidationOptions } from "./ez-validation-options.interface";

export interface IEzFormEntryOptions {
  entryName: string;
  validatorOptions: IEzValidationOptions[];
  valueChangesSubscribers: ((valueChanges$: Observable<any>) => void)[];
  statusChangesSubscribers: ((
    statusChanges$: Observable<FormStatus>
  ) => void)[];
  updateOn: UpdateOn;
}
