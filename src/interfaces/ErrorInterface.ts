import { AppError } from '../utils/appError';

export interface OptionalError {
  err: AppError | null;
}
