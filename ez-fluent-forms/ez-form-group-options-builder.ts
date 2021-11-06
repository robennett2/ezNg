import EzOptionsBuilderBase from "./base/ez-options-builder-base";
import EzFormGroupBuilder from "./ez-form-group-builder";
import { IEzFormGroupOptionBuilder } from "./interfaces/builders/ez-form-group-option-builder.interface";

export default class EzFormGroupOptionsBuilder extends EzOptionsBuilderBase<
  IEzFormGroupOptionBuilder,
  EzFormGroupBuilder,
  any
> {
  public mapToModelCallbacks: ((formValue: any) => any)[] = [];

  mapsToModel(
    modelInstance: any,
    controlPrefix?: string
  ): IEzFormGroupOptionBuilder {
    const callback = (formValue: any) => {
      for (const rawKey in formValue) {
        const key = controlPrefix ? rawKey.replace(controlPrefix, "") : rawKey;

        if (!controlPrefix || rawKey.startsWith(controlPrefix)) {
          if (formValue.hasOwnProperty(rawKey)) {
            if (!modelInstance.hasOwnProperty(key)) continue;

            modelInstance[key] = formValue[rawKey];
          }
        }
      }
    };

    this.mapToModelCallbacks.push(callback);
    return this;
  }
}
