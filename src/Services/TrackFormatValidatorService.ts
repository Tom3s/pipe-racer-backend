import { InvalidTrackFormatError } from "../Errors/InvalidTrackFormatError";

export const validateTrackFormat = (track: any) => {
	// console.log(track?.format);
	switch (track?.format) {
		case 1:
			// validateTrackFormat1(track);
			throw new InvalidTrackFormatError("Track format 1 is not supported");
			break;
		case 2:
			// validateTrackFormat2(track);
			throw new InvalidTrackFormatError("Track format 2 is not supported");
			break;
		case 3:
			// validateTrackFormat3(track);
			throw new InvalidTrackFormatError("Legacy format tracks can no longer be uploaded");
			break;
		case 4:
			validateTrackFormat4(track);
			break;

		default:
			throw new InvalidTrackFormatError("Invalid track format id");
	}
};

export const validateTrackFormat1 = (track: any) => {
	const requiredFields = [
		// "format",
		"trackName",
		"lapCount",
		"trackPieces",
		"start",
		"checkPoints",
		// "props"
	];

	if (!track.author){
		track.author = "unknown";
	}

	for (const field of requiredFields) {
		if (!track.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("No metadata");
		}
	}

	for (const trackPiece of track.trackPieces) {
		verifyTrackPiece(trackPiece);
	}

	if (track.checkPoints.length <= 0) {
		throw new InvalidTrackFormatError("Track must have at least one checkpoint");
	}
	for (const checkPoint of track.checkPoints) {
		verifyCheckPoint(checkPoint);
	}

	if (!track.props){
		return;
	}

	for (const prop of track.props) {
		verifyProp(prop);
	}
};

export const validateTrackFormat3 = (track: any) => {
	const requiredFields = [
		// "validated",
		"bestLapTime",
		"bestLapReplay",
		"bestTotalTime",
		"bestTotalReplay",
	]

	if (track["validated"] === undefined) {
		throw new InvalidTrackFormatError("Unvalidated track");
	} else {
		if (!track["validated"]) {
			throw new InvalidTrackFormatError("Unvalidated track");
		}
	}

	for (const field of requiredFields) {
		if (!track.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("No validation data");
		}
	}

	validateTrackFormat2(track);
}

export const validateTrackFormat2 = (track: any) => {
	const requiredFields = [
		// "format",
		"trackName",
		"lapCount",
		"trackPieces",
		"start",
		"checkPoints",
		// "props"
	];

	if (!track.author){
		track.author = "unknown";
	}

	for (const field of requiredFields) {
		if (!track.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("No metadata");
		}
	}

	for (const trackPiece of track.trackPieces) {
		verifyTrackPiece(trackPiece);
	}

	if (track.checkPoints.length <= 0) {
		throw new InvalidTrackFormatError("Track must have at least one checkpoint");
	}
	for (const checkPoint of track.checkPoints) {
		verifyCheckPoint(checkPoint);
	}

	if (!track.props){
		return;
	}

	for (const prop of track.props) {
		verifyProp2(prop);
	}
};

const verifyTrackPiece = (trackPiece: any) => {
	const requiredFields = [
		"leftStartHeight",
		"leftEndHeight",
		"leftSmoothTilt",
		"rightStartHeight",
		"rightEndHeight",
		"rightSmoothTilt",
		"leftWallStart",
		"leftWallEnd",
		"rightWallStart",
		"rightWallEnd",
		"curve",
		"endOffset",
		"smoothOffset",
		"length",
		"curveForward",
		"curveSideways",
		"roadType",
		"positionX",
		"positionY",
		"positionZ",
		"rotation"
	];

	for (const field of requiredFields) {
		if (!trackPiece.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("Invalid track piece format");
		}
	}
};

const verifyCheckPoint = (checkPoint: any) => {
	const requiredFields = [
		"positionX",
		"positionY",
		"positionZ",
		"rotation"
	];

	for (const field of requiredFields) {
		if (!checkPoint.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("Invalid checkpoint format");
		}
	}
}

const verifyProp = (prop: any) => {
	const requiredFields = [
		"positionX",
		"positionY",
		"positionZ",
		"rotation",
		"textureIndex",
	];

	for (const field of requiredFields) {
		if (!prop.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("Invalid prop format");
		}
	}
}

const verifyProp2 = (prop: any) => {
	const requiredFields = [
		"positionX",
		"positionY",
		"positionZ",
		"rotation",
		"textureName",
	];

	for (const field of requiredFields) {
		if (!prop.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError("Invalid prop format");
		}
	}
}

export const validateTrackFormat4 = (track: any) => {
	const requiredMetadataFields = [
		"trackName",
		"lapCount",

		"validated",
		"bestTotalTime",
		"bestTotalReplay",
		"bestLapTime",
		"bestLapReplay",
	]

	if (track["metadata"] === undefined) {
		throw new InvalidTrackFormatError("No metadata");
	} else {
		for (const field of requiredMetadataFields) {
			if (!track.metadata.hasOwnProperty(field)) {
				throw new InvalidTrackFormatError(`Missing metadata field: ${field}`);
			}
		}
	}

	if (track["validated"] === undefined) {
		throw new InvalidTrackFormatError("Unvalidated track");
	} else {
		if (!track["validated"]) {
			throw new InvalidTrackFormatError("Unvalidated track");
		}
	
	}


	const requiredFields = [
		"start",
		"checkpoints"
	]

	for (const field of requiredFields) {
		if (!track.hasOwnProperty(field)) {
			throw new InvalidTrackFormatError(`Missing field: ${field}`);
		}
	}

	// the rest is optional
}

