import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, take } from "rxjs/operators";
import { IEzValidationMessage } from "../types/ez-validation-message.interface";
import { IEzValidationOptions } from "../types/options/ez-validation-options.interface";

export const ValidatorOptionsAlreadyRegisteredForFormEntryError = (
  entryName: string
) =>
  new Error(
    `Validator options have already been registered for the form entry: ${entryName}`
  );

export interface IEzRaisedValidationMessage {
  validationMessage: IEzValidationMessage | null;
  forEntry: string;
  errorName: string;
}

@Injectable({
  providedIn: "root",
})
export class EzValidationMessageService {
  private formEntryToValidationOptionsMap: {
    [entryName: string]: IEzValidationOptions;
  } = {};

  private validationMessagesSubject = new BehaviorSubject<
    IEzRaisedValidationMessage[]
  >([]);

  private getValidationOptionsForFormEntry(
    entryName: string
  ): IEzValidationOptions | null {
    return this.formEntryToValidationOptionsMap[entryName] ?? null;
  }

  raiseMessage(raisedMessage: IEzRaisedValidationMessage) {
    this.validationMessagesSubject.pipe(take(1)).subscribe((raisedMessages) => {
      this.validationMessagesSubject.next([...raisedMessages, raisedMessage]);
    });
  }

  unraiseMessage(raisedMessageToRemove: IEzRaisedValidationMessage) {
    this.validationMessagesSubject.pipe(take(1)).subscribe((raisedMessages) => {
      do {
        var index = raisedMessages.findIndex(
          (currentlyRaisedMessage) =>
            currentlyRaisedMessage.forEntry ===
              raisedMessageToRemove.forEntry &&
            currentlyRaisedMessage.errorName === raisedMessageToRemove.errorName
        );

        if (index >= 0) raisedMessages.splice(index, 1);
      } while (index >= 0);

      this.validationMessagesSubject.next([...raisedMessages]);
    });
  }

  registerValidatorConfiguration(configuration: IEzValidationOptions) {
    if (
      this.formEntryToValidationOptionsMap.hasOwnProperty(
        configuration.entryName
      )
    ) {
      throw ValidatorOptionsAlreadyRegisteredForFormEntryError(
        configuration.entryName
      );
    }

    this.formEntryToValidationOptionsMap[
      configuration.entryName
    ] = configuration;
  }

  registerEzValidationMessageComponentForEntry(
    formControlName: string
  ): Observable<IEzValidationMessage[]> {
    const validationOptions = this.getValidationOptionsForFormEntry(
      formControlName
    );

    if (!validationOptions) {
      return of([]);
    }

    return this.validationMessagesSubject.asObservable().pipe(
      map((raisedMessages) =>
        raisedMessages.filter(
          (raisedMessage) =>
            raisedMessage.forEntry === validationOptions.entryName &&
            validationOptions.errorNames.includes(raisedMessage.errorName) &&
            raisedMessage.validationMessage
        )
      ),
      map((raisedMessages) =>
        raisedMessages.map(
          (raisedMessage) =>
            raisedMessage.validationMessage as IEzValidationMessage
        )
      )
    );
  }
}
