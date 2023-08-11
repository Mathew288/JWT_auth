import express, { Express } from 'express';
import mongoose from 'mongoose';
import { json } from 'stream/consumers';
import productRoutes from './routes/product';
import userRoutes from './routes/user'

const app: Express = express();
app.use(express.json());
mongoose
  .connect('mongodb://localhost:27017', {
    dbName: 'MERN',
  })
  .then(() => {
    console.log('database connection is ready');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/apiv1', productRoutes);
app.use('/apiv1', userRoutes);

app.listen(3000, () => {
  console.log('The server is running on port', 3000);
});