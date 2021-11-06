import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";
import { IEzValidationMessage } from "../../types/ez-validation-message.interface";

@Component({
  selector: "ez-validation-message",
  templateUrl: "./ez-validation-message.component.html",
  styleUrls: ["./ez-validation-message.component.scss"],
})
export class EzValidationMessageComponent implements OnInit, OnDestroy {
  @Input("forControl") formControlName!: string;
  private onDestroyedSubject = new Subject<void>();
  validationMessages: IEzValidationMessage[] = [];

  constructor(private ezValidationMessageService: EzValidationMessageService) {}

  ngOnInit(): void {
    this.ezValidationMessageService
      .registerEzValidationMessageComponentForEntry(this.formControlName)
      .pipe(takeUntil(this.onDestroyedSubject))
      .subscribe((errorMessages: IEzValidationMessage[]) => {
        this.validationMessages = errorMessages;
      });
  }

  ngOnDestroy(): void {
    this.onDestroyedSubject.next();
    this.onDestroyedSubject.complete();
  }
}
