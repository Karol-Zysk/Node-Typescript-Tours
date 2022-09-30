import { fail } from 'assert';
import { NextFunction, Request, Response } from 'express';
import { readFileSync, writeFile } from 'fs';
import router from '../routes/tourRoutes';

const tours = JSON.parse(
  readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString()
);

export const checkId = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid IDD ',
    });
  }
  next();
};
export const checkBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'No body or/and price',
    });
    
  }
  next();
};

export const getAllTours = (req: Request, res: Response) => {
  console.log(res.locals.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: res.locals.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

export const getTour = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const tour = tours.find((el: { id: number }) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const createTour = (req: Request, res: Response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

export const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updatet tour',
    },
  });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
