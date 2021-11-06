import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { EzValdiationMessageHostDirective } from "src/external/ezNg/ez-fluent-forms/directives/ez-valdiation-message-host.directive";
import { IEzValidationErrorOptions } from "../../ez-form-validation-builder";
import { IEzValidationError } from "../../interfaces/validatonErrors/ez-validation-error.interface";
import { IEzValidationErrorComponent } from "../../interfaces/validatonErrors/ez-validaton-error-component.interface";
import { IEzValidationMessageComponent } from "../../new/components/ez-validation-message-component.interface";
import { IEzValidationMessage } from "../../new/types/ez-validation-message.interface";

@Component({
  selector: "ez-validation-message-host",
  templateUrl: "./ez-validation-message-host.component.html",
  styleUrls: ["./ez-validation-message-host.component.scss"],
})
export class EzValidationMessageHostComponent implements OnInit {
  @Input() validationErrorOptions: IEzValidationMessage | null = null;
  @ViewChild(EzValdiationMessageHostDirective, { static: true })
  validationMessageHost!: EzValdiationMessageHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadHostedComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadHostedComponent();
  }

  private loadHostedComponent() {
    debugger;
    if (
      !this.validationErrorOptions ||
      !this.validationErrorOptions.componentType
    ) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.validationErrorOptions.componentType
    );

    const viewContainerRef = this.validationMessageHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(
      componentFactory
    );

    debugger;
    (componentRef.instance as IEzValidationMessageComponent).validationMessage = this.validationErrorOptions;
  }
}
