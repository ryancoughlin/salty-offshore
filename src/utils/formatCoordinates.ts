type CoordinateFormat = "DD" | "DMS" | "DMM";

// Configure precision for all formats
const PRECISION = {
  DD: 2, // Decimal degrees precision (e.g., 42.12°)
  DMS: 0, // Seconds precision (e.g., 42°7'0"N)
  DMM: 1, // Minutes precision (e.g., 42° 7.1'N)
} as const;

const getDirection = (coordinate: number, isLongitude: boolean): string =>
  isLongitude ? (coordinate >= 0 ? "E" : "W") : coordinate >= 0 ? "N" : "S";

const convertToDMS = (coordinate: number, isLongitude: boolean): string => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Number(
    ((minutesNotTruncated - minutes) * 60).toFixed(PRECISION.DMS)
  );

  const direction = getDirection(coordinate, isLongitude);

  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

const convertToDMM = (coordinate: number, isLongitude: boolean): string => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutes = Number(((absolute - degrees) * 60).toFixed(PRECISION.DMM));

  const direction = getDirection(coordinate, isLongitude);

  return `${degrees}° ${minutes}'${direction}`;
};

export const formatCoordinates = (
  coordinates: [number, number],
  format: CoordinateFormat = "DD"
): string => {
  const [longitude, latitude] = coordinates;

  switch (format) {
    case "DMS":
      return `${convertToDMS(latitude, false)} ${convertToDMS(
        longitude,
        true
      )}`;
    case "DMM":
      return `${convertToDMM(latitude, false)} ${convertToDMM(
        longitude,
        true
      )}`;
    case "DD":
    default:
      return `${latitude.toFixed(PRECISION.DD)}°, ${longitude.toFixed(
        PRECISION.DD
      )}°`;
  }
};
