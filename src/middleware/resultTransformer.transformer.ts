import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
  success: boolean;
  count?: number;
}

export default class ResultTransformerClass<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data: T) => {
        const response = {
          success: true,
          count: undefined,
          data,
        };
        if (Array.isArray(data)) {
          response.count = data.length;
        }
        return response;
      }),
    );
  }
}
