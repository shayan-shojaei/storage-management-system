import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export default class PopulateQuery implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { query } = context.switchToHttp().getRequest();

    // check if 'fill' was passed as the string 'true' in the request
    // if so, convert to boolean
    query.fill = (query.fill !== undefined && query.fill === 'true') || false;

    return next.handle();
  }
}
