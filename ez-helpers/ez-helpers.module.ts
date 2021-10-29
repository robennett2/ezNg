import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PackEnumPipe } from "./pipes/pack-enum.pipe";

@NgModule({
  declarations: [PackEnumPipe],
  exports: [PackEnumPipe],
  imports: [CommonModule],
})
export class EzHelpersModule {}
