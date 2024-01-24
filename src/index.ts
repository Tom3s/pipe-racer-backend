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
import https from 'https';
import fs from 'fs';
import path from 'path';
import { setupStatRoutes } from './Routing/SetupStatRoutes';
import { TrackStatService } from './Services/TrackStatService';
import { TrackStatRepository } from './Repositories/TrackStatRepository';
import { UserStatService } from './Services/UserStatService';
import { migrateCompletedRunsToStats } from './Global/MigrateStats';
import { EditorStatRepository } from './Repositories/EditorStatRepository';
import { EditorStatService } from './Services/EditorStatService';
import { setupGlobalRankRoutes } from './Routing/SetupGlobalRankRoutes';
import { GlobalScoreService } from './Services/GlobalScoreService';
import { GlobalScoreRepository } from './Repositories/GlobalScoreRepository';
import { setupCommentRoutes } from './Routing/SetupCommentRoutes';
import { CommentService } from './Services/CommentService';
import { CommentRepository } from './Repositories/CommentRepository';
import { CommentRatingRepository } from './Repositories/CommentRatingRepository';
import { CommentRatingService } from './Services/CommentRatingService';
import { Replay } from './Models/Replay';
import { ReplayRepository } from './Repositories/ReplayRepository';
import { ReplayFileService } from './Services/ReplayFileService';
import { ReplayService } from './Services/ReplayService';
import { setupReplayRoutes } from './Routing/SetupReplayRoutes';
import { CollectedMedalRepository } from './Repositories/CollectedMedalRepository';
import { CollectedMedalService } from './Services/CollectedMedalService';
import { setupMedalRoutes } from './Routing/SetupMedalRoutes';

dotenv.config();

const app: Express = express();

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
const trackStatRepository = new TrackStatRepository();
const editorStatRepository = new EditorStatRepository();
const globalScoreRepository = new GlobalScoreRepository();
const commentRepository = new CommentRepository();
const commentRatingRepository = new CommentRatingRepository();
const replayRepository = new ReplayRepository();
const collectedMedalRepository = new CollectedMedalRepository();

const imageFileService = new ImageFileService();
const trackFileService = new TrackFileService();
const trackService = new TrackService(trackRepository, ratingRepository, trackFileService);
const authService = new AuthenticationService(userRepository);
const userService = new UserService(userRepository);
const ratingService = new RatingService(ratingRepository, trackService);
const collectedMedalService = new CollectedMedalService(collectedMedalRepository, trackRepository);
const leaderboardService = new LeaderboardService(completedRunRepository, collectedMedalService);
const trackStatService = new TrackStatService(trackStatRepository);
const editorStatService = new EditorStatService(editorStatRepository);
const globalScoreService = new GlobalScoreService(globalScoreRepository, userService, trackService, leaderboardService);
const userStatService = new UserStatService(trackStatService, editorStatService, trackService, ratingService, globalScoreService);
const commentService = new CommentService(commentRepository, commentRatingRepository)
const commentRatingService = new CommentRatingService(commentRatingRepository, commentService);
const replayFileService = new ReplayFileService();
const replayService = new ReplayService(replayRepository, replayFileService, leaderboardService);

setupAuthenticationRoutes(app, authService);
setupUserRoutes(app, userService, imageFileService);
setupTrackRoutes(app, trackService, trackFileService);
setupLeaderboardRoutes(app, leaderboardService);
setupRatingRoutes(app, ratingService);
setupStatRoutes(app, trackStatService, editorStatService, userStatService);
setupGlobalRankRoutes(app, globalScoreService);
setupCommentRoutes(app, commentService, commentRatingService);
setupReplayRoutes(app, replayService);
setupMedalRoutes(app, collectedMedalService);

const privateKeyPath = path.join(__dirname, '../key.pem');
const certificatePath = path.join(__dirname, '../cert.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { 
	key: privateKey, 
	cert: certificate,
	passphrase: process.env.SSL_PASSPHRASE,
};

// migrateCompletedRunsToStats();

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3443, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:3443`);
});

app.listen(3080, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:3080`);
});
