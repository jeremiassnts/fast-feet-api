export class PhotoMissingError extends Error {
  constructor() {
    super(`The delivery photo was not sent`);
  }
}
