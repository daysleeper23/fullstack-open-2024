import { Request, Response, NextFunction } from 'express';

const unknownEndpoint = async (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

/*
  Error handling middleware
*/
class ApiError extends Error {
  name: string;
  status: number;
  constructor(name: string, status: number, message: string) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

const createError = (status: number, message: string) => new ApiError('CreateError', status, message);
const updateError = (status: number, message: string) => new ApiError('UpdateError', status, message);

const errorHandler = (error: ApiError, _request: Request, response: Response, next: NextFunction) => 
{
  if (error.name === 'CreateError') {
    return response.status(error.status).send({ error: 'Error while creating blog', message: error.message })
  } else if (error.name === 'UpdateError') {
    return response.status(error.status).send({ error: 'Error while updating blog', message: error.message })
  }

  return next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
export { unknownEndpoint, errorHandler, createError, updateError };