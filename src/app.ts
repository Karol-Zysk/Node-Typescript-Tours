import express, { Request, Response } from 'express';
import { readFileSync, writeFile } from 'fs';

const app = express();

app.use(express.json());

const port = 3000;

const tours = JSON.parse(
  readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req: Request, res: Response) => {
  const newId = tours[tours.length-1].id +1 
  const newTour = Object.assign({id: newId}, req.body )

tours.push(newTour)
writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
  res.status(201).json({
    status: "success",
    data: {tour: newTour}
  })
})

  
});

app.listen(port, () => {
  console.log(`App listenning at http://localhost:${port}`);
});
