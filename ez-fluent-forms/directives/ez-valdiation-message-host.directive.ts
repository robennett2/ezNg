import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appEzValdiationMessageHost]",
})
export class EzValdiationMessageHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
