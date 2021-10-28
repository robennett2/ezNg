import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { EzFluentFormsModule } from "src/external/ezNg/ez-fluent-forms/ez-fluent-forms.module";
import EzFormGroupBuilder from "src/external/ezNg/ez-fluent-forms/ez-form-group-builder";

@Injectable({
  providedIn: EzFluentFormsModule,
})
export class EzFluentFormsService {
  constructor(private formBuilder: FormBuilder) {}

  createGroup(): EzFormGroupBuilder {
    return new EzFormGroupBuilder(this.formBuilder);
  }
}
