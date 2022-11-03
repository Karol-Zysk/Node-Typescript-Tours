import { NextFunction, Request, Response } from 'express';
import { ITourModel } from '../interfaces/tourModelInterfaces';
import { Tour } from '../models/tourModel';
import { APIFeatures } from '../utils/apiFeatures';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { ParsedQs } from 'qs';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';

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

export const getAllTours = getAll(Tour);

export const getTour = getOne(Tour, 'reviews');

export const createTour = createOne(Tour);

export const updateTour = updateOne(Tour);

export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
    next();
  }
);

enum Unit {
  mi = 'mi',
  km = 'km',
}

interface IGeoTourParams extends ParsedQs {
  distance: string;
  latlng: string;
  unit: Unit;
}

export const getToursWithin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance, latlng, unit } = req.params as IGeoTourParams;
    const [lat, lng] = latlng.split(',');

    const radious =
      unit == Unit.mi ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

    if (!lat || !lng) {
      return next(
        new AppError(
          'please provide lattitude, longitude in format: lat,long',
          400
        )
      );
    }

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radious] } },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  }
);
export const getDistancesByLatLang = catchAsync(
  async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params as IGeoTourParams;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) {
      return next(
        new AppError(
          'Please provide latitude and longitude in format lat,lng',
          400
        )
      );
    }
    if (!['mi', 'km'].includes(unit)) {
      return next(new AppError('Please provide unit (mi or km)', 400));
    }
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    const results = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);
    res.status(200).json({ status:"success", count: results.length, results });
  }
);
