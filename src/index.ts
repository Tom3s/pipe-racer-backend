import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './connectToDatabase';
import { AuthenticationService } from './Services/AuthenticationService';
import { UserRepository } from './Repositories/UserRepository';
import { setupAuthenticationRoutes } from './Routing/SetupAuthenticationRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

connectToDatabase();

const userRepository = new UserRepository();
const authService = new AuthenticationService(userRepository);

setupAuthenticationRoutes(app, authService);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});