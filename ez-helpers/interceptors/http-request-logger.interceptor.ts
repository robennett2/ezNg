import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggerService } from "src/app/shared/services/logger.service";
import { Guid } from "guid-typescript";
import { tap } from "rxjs/operators";

@Injectable()
export class HttpRequestLoggerInterceptor implements HttpInterceptor {
  private readonly loggerPrefix = "[HttpRequestLoggerInterceptor]";

  constructor(private loggerService: LoggerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const requestId = Guid.create();
    this.loggerService.debug(
      `${this.loggerPrefix} [${requestId}] ${request.method} request made to ${request.url}.`,
      {
        headers: request.headers,
        body: request.body,
      }
    );

    request.url;

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type !== HttpEventType.Response) {
          this.loggerService.debug(
            `${this.loggerPrefix} [${requestId}] event recieved: ${
              HttpEventType[event.type]
            }`
          );
        } else {
          const responseEvent = event as HttpResponse<any>;
          this.loggerService.debug(
            `${this.loggerPrefix} [${requestId}] response recieved with status ${responseEvent.statusText} (${responseEvent.status})`,
            {
              responseEvent: responseEvent,
            }
          );
        }
      })
    );
  }
}
