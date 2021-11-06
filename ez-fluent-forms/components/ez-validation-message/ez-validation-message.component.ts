import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IEzValidationError } from "../../interfaces/validatonErrors/ez-validation-error.interface";
import { EzValidationMessageService } from "../../services/ez-validation-message.service";

@Component({
  selector: "app-ez-validation-message",
  templateUrl: "./ez-validation-message.component.html",
  styleUrls: ["./ez-validation-message.component.scss"],
})
export class EzValidationMessageComponent implements OnInit, OnDestroy {
  validationErrors: IEzValidationError[] = [];
  private onDestroyedSubject = new Subject<void>();

  constructor(private ezValidationMessageService: EzValidationMessageService) {}

  ngOnInit(): void {
    this.ezValidationMessageService.validationErrors$
      .pipe(takeUntil(this.onDestroyedSubject))
      .subscribe(
        (validationErrors) => (this.validationErrors = validationErrors)
      );
  }

  ngOnDestroy(): void {
    this.onDestroyedSubject.next();
    this.onDestroyedSubject.complete();
  }
}
