import { InvalidTrackFormatError } from "../Errors/InvalidTrackFormatError";

export const validateTrackFormat = (track: any) => {
	// console.log(track?.format);
	switch (track?.format) {
		case 1:
			validateTrackFormat1(track);
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