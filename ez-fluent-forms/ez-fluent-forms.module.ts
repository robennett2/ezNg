import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { EzValidationMessageHostComponent } from "src/external/ezNg/ez-fluent-forms/components/ez-validation-message-host/ez-validation-message-host.component";
import { EzValdiationMessageHostDirective } from "./directives/ez-valdiation-message-host.directive";
import { EzValidationMessageComponent } from "./components/ez-validation-message/ez-validation-message.component";

@NgModule({
  declarations: [
    EzValidationMessageComponent,
    EzValidationMessageHostComponent,
    EzValdiationMessageHostDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [EzValidationMessageComponent],
})
export class EzFluentFormsModule {}
