import { FormControl } from "@angular/forms";
import IBuilder from "./builder.interface";

export type IFormControlBuilder = IBuilder<FormControl> & {
  controlName: string;
};
