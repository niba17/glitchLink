export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(entity: string = "Resource") {
    super(`${entity} not found`, 404);
  }
}

export class ExpiredError extends CustomError {
  constructor(entity: string = "Resource") {
    super(`${entity} expired`, 410); // 410 Gone
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Conflict occurred") {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
  }
}

export class ValidationError extends BadRequestError {
  public issues?: any[];

  constructor(message: string = "Validation failed", issues?: any[]) {
    super(message);
    this.issues = issues;
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor(message: string = "Access token expired") {
    super(message);
  }
}

export class InvalidTokenError extends UnauthorizedError {
  constructor(message: string = "Invalid or malformed token") {
    super(message);
  }
}

export class InvalidInputError extends BadRequestError {
  constructor(message: string = "Invalid input provided") {
    super(message);
  }
}
