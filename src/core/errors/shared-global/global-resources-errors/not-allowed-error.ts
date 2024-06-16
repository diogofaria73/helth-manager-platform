import { UseCaseError } from '../use-cases-errors/use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed');
  }
}
