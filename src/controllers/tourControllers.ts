import { Request, Response } from 'express';
import { readFileSync, writeFile } from 'fs';

const tours = JSON.parse(
  readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString()
);

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
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'no tour with this ID',
    });
  } else
    return res.status(200).json({
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
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'no tour with this ID',
    });
  } else
    res.status(200).json({
      status: 'success',
      data: {
        tour: 'Updatet tour',
      },
    });
};

export const deleteTour = (req: Request, res: Response) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'no tour with this ID',
    });
  } else
    res.status(204).json({
      status: 'success',
      data: null,
    });
};
