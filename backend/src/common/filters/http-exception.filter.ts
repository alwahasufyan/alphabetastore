import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private getErrorCode(status: number, responseBody: unknown): string {
    if (
      responseBody &&
      typeof responseBody === 'object' &&
      'errorCode' in responseBody &&
      typeof (responseBody as { errorCode?: unknown }).errorCode === 'string'
    ) {
      return (responseBody as { errorCode: string }).errorCode;
    }

    const statusName = HttpStatus[status as unknown as keyof typeof HttpStatus];

    if (typeof statusName === 'string') {
      return statusName;
    }

    return 'INTERNAL_SERVER_ERROR';
  }

  private getErrorMessage(responseBody: unknown): string {
    if (typeof responseBody === 'string') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object') {
      const body = responseBody as { message?: unknown };

      if (Array.isArray(body.message)) {
        return body.message.join(', ');
      }

      if (typeof body.message === 'string') {
        return body.message;
      }
    }

    return 'Internal server error';
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    response.status(status).json({
      success: false,
      errorCode: this.getErrorCode(status, responseBody),
      message: this.getErrorMessage(responseBody),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}