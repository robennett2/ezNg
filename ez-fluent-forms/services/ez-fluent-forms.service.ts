import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { EzFluentFormsModule } from "src/external/ezNg/ez-fluent-forms/ez-fluent-forms.module";
import { EzFormGroupBuilder } from "../builders/group/ez-form-group-builder";
import { IEzFormGroupBuilder } from "../builders/group/ez-form-group-builder.interface";
import { EzValidationMessageService } from "./ez-validation-message.service";

@Injectable({
  providedIn: EzFluentFormsModule,
})
export class EzFluentFormsService {
  constructor(
    private formBuilder: FormBuilder,
    private ezValidationMessageService: EzValidationMessageService
  ) {}

  createGroup(entryName: string): IEzFormGroupBuilder {
    return new EzFormGroupBuilder(
      entryName,
      this.formBuilder,
      this.ezValidationMessageService
    );
  }
}
