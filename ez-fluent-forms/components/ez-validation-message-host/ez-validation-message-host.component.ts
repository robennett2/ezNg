import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { EzValdiationMessageHostDirective } from "src/external/ezNg/ez-fluent-forms/directives/ez-valdiation-message-host.directive";
import { IEzValidationError } from "../../interfaces/validatonErrors/ez-validation-error.interface";
import { IEzValidationErrorComponent } from "../../interfaces/validatonErrors/ez-validaton-error-component.interface";

@Component({
  selector: "ez-validation-message-host",
  templateUrl: "./ez-validation-message-host.component.html",
  styleUrls: ["./ez-validation-message-host.component.scss"],
})
export class EzValidationMessageHostComponent implements OnInit {
  @Input() validationError: IEzValidationError | null = null;
  @ViewChild(EzValidationMessageHostComponent, { static: true })
  validationMessageHost!: EzValdiationMessageHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadHostedComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const scheduableChange = changes["scheduable"];
    if (
      scheduableChange &&
      scheduableChange.currentValue !== scheduableChange.previousValue
    ) {
      this.loadHostedComponent();
    }
  }

  private loadHostedComponent() {
    if (!this.validationError || !this.validationError.componentType) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.validationError.componentType
    );

    const viewContainerRef = this.validationMessageHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(
      componentFactory
    );
    (componentRef.instance as IEzValidationErrorComponent).validationError = this.validationError;
  }
}
