type CoordinateFormat = "DD" | "DMS" | "DMM";

const convertToDMS = (coordinate: number, isLongitude: boolean): string => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

  const direction = isLongitude
    ? coordinate >= 0
      ? "E"
      : "W"
    : coordinate >= 0
    ? "N"
    : "S";

  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

const convertToDMM = (coordinate: number, isLongitude: boolean): string => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutes = ((absolute - degrees) * 60).toFixed(4);

  const direction = isLongitude
    ? coordinate >= 0
      ? "E"
      : "W"
    : coordinate >= 0
    ? "N"
    : "S";

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
      return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
  }
};
