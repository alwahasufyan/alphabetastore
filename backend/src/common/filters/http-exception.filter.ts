import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

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

    const errorMessage = this.getErrorMessage(responseBody);

    // Log server errors with full stack trace; log client errors as warnings
    if (status >= 500) {
      Sentry.captureException(exception);
      this.logger.error(
        { err: exception, path: request.url, statusCode: status },
        `[${request.method}] ${request.url} → ${status}: ${errorMessage}`,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${request.method}] ${request.url} → ${status}: ${errorMessage}`,
      );
    }

    response.status(status).json({
      success: false,
      errorCode: this.getErrorCode(status, responseBody),
      message: errorMessage,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}