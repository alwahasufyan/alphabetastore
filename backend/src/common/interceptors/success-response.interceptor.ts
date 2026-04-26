import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type SuccessEnvelope<T> = {
  success: true;
  data: T;
};

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, SuccessEnvelope<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessEnvelope<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          typeof (data as { success?: unknown }).success === 'boolean'
        ) {
          return data as SuccessEnvelope<T>;
        }

        return {
          success: true,
          data: data as T,
        };
      }),
    );
  }
}
