export class NotFoundError extends Error {
  constructor(id: string, type: string) {
    super(`The ${type} with id ${id} was not found`);
  }
}
