import { HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const httpReq = req.clone({
      // Prevent caching in IE, in particular IE11.
      // See: https://support.microsoft.com/en-us/help/234067/how-to-prevent-caching-in-internet-explorer
      // headers: new HttpHeaders({
      //   'Access-Control-Allow-Headers': 'X-Custom-Header',
      //   'Cache-Control': 'no-cache',
      //   Pragma: 'no-cache',
      //   Expires: '0'
      // })
    });
    return next.handle(httpReq);
  }
}
