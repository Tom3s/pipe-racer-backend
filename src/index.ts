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
import { CompletedRunRepository } from './Repositories/CompletedRunRepository';
import { LeaderboardService } from './Services/LeaderboardService';
import { setupLeaderboardRoutes } from './Routing/SetupLeaderboardRoutes';
import { RatingRepository } from './Repositories/RatingRepository';
import { RatingService } from './Services/RatingService';
import { setupRatingRoutes } from './Routing/SetupRatingRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// app.use(express.json({limit: '10mb'}));
// app.use(express.urlencoded({limit: '10mb'}));
// app.use(express.bodyParser({limit: '10mb'}));

const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Session-Token']
}));


const bodyParser = require('body-parser');
app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));



connectToDatabase();

const userRepository = new UserRepository();
const trackRepository = new TrackRepository();
const completedRunRepository = new CompletedRunRepository();
const ratingRepository = new RatingRepository();
const imageFileService = new ImageFileService();
const trackFileService = new TrackFileService();
const trackService = new TrackService(trackRepository, ratingRepository, trackFileService);
const authService = new AuthenticationService(userRepository);
const userService = new UserService(userRepository);
const ratingService = new RatingService(ratingRepository, trackService);
const leaderboardService = new LeaderboardService(completedRunRepository);

setupAuthenticationRoutes(app, authService);
setupUserRoutes(app, userService, imageFileService);
setupTrackRoutes(app, trackService, trackFileService);
setupLeaderboardRoutes(app, leaderboardService);
setupRatingRoutes(app, ratingService);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});