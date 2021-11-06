import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { EzFluentFormsModule } from "src/external/ezNg/ez-fluent-forms/ez-fluent-forms.module";
import { EzFormGroupBuilder } from "../new/builders/group/ez-form-group-builder";
import { EzValidationMessageService } from "../new/services/ez-validation-message.service";

@Injectable({
  providedIn: EzFluentFormsModule,
})
export class EzFluentFormsService {
  constructor(
    private formBuilder: FormBuilder,
    private ezValidationMessageService: EzValidationMessageService
  ) {}

  createGroup(): EzFormGroupBuilder {
    return new EzFormGroupBuilder(
      this.formBuilder,
      this.ezValidationMessageService
    );
  }
}
