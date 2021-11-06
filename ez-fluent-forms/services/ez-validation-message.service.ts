import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { IEzValidationError } from "../interfaces/validatonErrors/ez-validation-error.interface";

@Injectable({
  providedIn: "root",
})
export class EzValidationMessageService {
  private validationErrorsSubject: Subject<
    IEzValidationError[]
  > = new ReplaySubject<IEzValidationError[]>();

  get validationErrors$(): Observable<IEzValidationError[]> {
    return this.validationErrorsSubject.asObservable();
  }

  constructor() {}
}
