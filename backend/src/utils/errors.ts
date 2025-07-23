// src/utils/errors.ts
export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UserNotFoundByIdError extends NotFoundError {
  constructor(message: string = "User not found") {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundByIdError.prototype);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Conflict occurred") {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
export class UserAlreadyExistsError extends ConflictError {
  constructor(message: string = "User with this email already exists") {
    super(message);
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message: string = "Invalid credentials") {
    super(message);
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Forbidden: Access denied") {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = "Bad request") {
    super(message, 400);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "An internal server error occurred") {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class MissingJwtSecretError extends InternalServerError {
  constructor(
    message: string = "Server configuration error: JWT secret not defined"
  ) {
    super(message);
    Object.setPrototypeOf(this, MissingJwtSecretError.prototype);
  }
}
export class NoTokenError extends UnauthorizedError {
  constructor(message: string = "No token provided or invalid format") {
    super(message);
    Object.setPrototypeOf(this, NoTokenError.prototype);
  }
}

export class UserNotFoundInTokenError extends UnauthorizedError {
  constructor(message: string = "Unauthorized: User not found") {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundInTokenError.prototype);
  }
}

export class UserNotFoundError extends UnauthorizedError {
  constructor(message: string = "Unauthorized: User not found") {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class LinkNotFoundError extends NotFoundError {
  constructor(message: string = "Link not found") {
    super(message);
    Object.setPrototypeOf(this, LinkNotFoundError.prototype);
  }
}

export class LinkNotFoundOrExpiredError extends LinkNotFoundError {
  constructor(message: string = "Link not found or expired") {
    super(message);
    Object.setPrototypeOf(this, LinkNotFoundOrExpiredError.prototype);
  }
}

export class LinkExpiredError extends BadRequestError {
  constructor(message: string = "Link has expired") {
    super(message);
    Object.setPrototypeOf(this, LinkExpiredError.prototype);
  }
}

export class CustomAliasAlreadyInUseError extends ConflictError {
  constructor(message: string = "Custom alias is already in use") {
    super(message);
    Object.setPrototypeOf(this, CustomAliasAlreadyInUseError.prototype);
  }
}

export class CustomAliasTakenByAnotherLinkError extends ConflictError {
  constructor(message: string = "Custom alias already taken by another link") {
    super(message);
    Object.setPrototypeOf(this, CustomAliasTakenByAnotherLinkError.prototype);
  }
}

export class LinkNotOwnedByUserError extends ForbiddenError {
  constructor(message: string = "Unauthorized: You do not own this link") {
    super(message);
    Object.setPrototypeOf(this, LinkNotOwnedByUserError.prototype);
  }
}

export class QRCodeGenerationError extends InternalServerError {
  constructor(message: string = "Failed to generate QR code") {
    super(message);
    Object.setPrototypeOf(this, QRCodeGenerationError.prototype);
  }
}

export class CannotGenerateQRCodeForExpiredLinkError extends BadRequestError {
  constructor(message: string = "Cannot generate QR code for an expired link") {
    super(message);
    Object.setPrototypeOf(
      this,
      CannotGenerateQRCodeForExpiredLinkError.prototype
    );
  }
}

export class InvalidInputError extends BadRequestError {
  constructor(message: string = "Invalid input provided") {
    super(message);
    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }
}

export class ValidationError extends BadRequestError {
  public issues?: any[];

  constructor(message: string = "Validation failed", issues?: any[]) {
    super(message);
    this.issues = issues;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor(message: string = "Access token has expired") {
    super(message);
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

export class InvalidTokenError extends UnauthorizedError {
  constructor(message: string = "Invalid or malformed access token") {
    super(message);
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}
