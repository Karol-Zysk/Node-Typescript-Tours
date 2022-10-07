import { NextFunction, Request, Response } from 'express';
import { Tour } from '../models/tourModel';
import { APIFeatures } from '../utils/apiFeatures';
import { catchAsync } from '../utils/catchAsync';

export const aliasTopTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,summary,difficulty';
  next();
};

export const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const getTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });

    next();
  }
);

export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
    next();
  }
);

export const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await Tour.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response) => {
    const year = Number(req.params.year);
    const busyMonth = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    res.status(200).json({
      length: busyMonth.length,
      status: 'success',
      data: {
        busyMonth,
      },
    });
  }
);
