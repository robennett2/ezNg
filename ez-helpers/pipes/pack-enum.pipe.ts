import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "ezPackEnum",
})
export class PackEnumPipe implements PipeTransform {
  transform(theEnum: any, ...args: unknown[]): { key: string; value: any }[] {
    const keys = Object.keys(theEnum).filter((key) => isNaN(Number(key)));
    console.log(keys);
    const keyValuePairs: { key: string; value: any }[] = [];

    keys.forEach((key) =>
      keyValuePairs.push({ key: key, value: theEnum[key] })
    );

    return keyValuePairs;
  }
}
