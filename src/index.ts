import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './connectToDatabase';
import { AuthenticationService } from './Services/AuthenticationService';
import { UserRepository } from './Repositories/UserRepository';
import { setupAuthenticationRoutes } from './Routing/SetupAuthenticationRoutes';
import { UserService } from './Services/UserService';
import { setupUserRoutes } from './Routing/SetupUserRoutes';
import { ImageFileService } from './Services/ImageFileService';
import { setupTrackRoutes } from './Routing/SetupTrackRoutes';
import { TrackService } from './Services/TrackService';
import { TrackFileService } from './Services/TrackFileService';
import { TrackRepository } from './Repositories/TrackRepository';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Session-Token']
}));

connectToDatabase();

const userRepository = new UserRepository();
const trackRepository = new TrackRepository();
const imageFileService = new ImageFileService();
const trackFileService = new TrackFileService();
const trackService = new TrackService(trackRepository, trackFileService);
const authService = new AuthenticationService(userRepository);
const userService = new UserService(userRepository);

setupAuthenticationRoutes(app, authService);
setupUserRoutes(app, userService, imageFileService);
setupTrackRoutes(app, trackService, trackFileService);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});