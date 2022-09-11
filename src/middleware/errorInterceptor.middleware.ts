import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { BSONTypeError } from 'bson';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BSONTypeError) {
          // Invalid ObjectID passed - Throw 404
          return throwError(() => new NotFoundException());
        }

        // Throw non-mapped errors
        return throwError(() => new BadGatewayException());
      }),
    );
  }
}
