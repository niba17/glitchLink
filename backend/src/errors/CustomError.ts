export class CustomError extends Error {
  public status: number;
  public details?: { path?: string; message: string }[];

  constructor(
    message: string,
    status: number = 500,
    details?: { path?: string; message: string }[]
  ) {
    super(message);
    this.name = "CustomError";
    this.status = status;
    this.details = details;
  }
}
