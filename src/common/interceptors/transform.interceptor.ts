import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response as ExpressResponse } from 'express';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        // Check if the handler already returned a specifically formatted response
        // extracting it to normalize the payload.
        const responseData = data?.data !== undefined ? data.data : data;
        const message = data?.message || 'Operation successful';

        return {
          statusCode: response.statusCode,
          message: message,
          data: responseData,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
