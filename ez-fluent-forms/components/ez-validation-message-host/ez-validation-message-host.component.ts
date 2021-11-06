import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { EzValdiationMessageHostDirective } from "src/external/ezNg/ez-fluent-forms/directives/ez-valdiation-message-host.directive";
import { IEzValidationMessageComponent } from "../../types/ez-validation-message-component.interface";
import { IEzValidationMessage } from "../../types/ez-validation-message.interface";

@Component({
  selector: "ez-validation-message-host",
  templateUrl: "./ez-validation-message-host.component.html",
  styleUrls: ["./ez-validation-message-host.component.scss"],
})
export class EzValidationMessageHostComponent implements OnInit {
  @Input() validationMessage: IEzValidationMessage | null = null;
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
    if (!this.validationMessage || !this.validationMessage.componentType) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.validationMessage.componentType
    );

    const viewContainerRef = this.validationMessageHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(
      componentFactory
    );

    (componentRef.instance as IEzValidationMessageComponent).validationMessage = this.validationMessage;
  }
}
