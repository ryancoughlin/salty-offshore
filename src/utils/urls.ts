export const getDataUrl = (
  regionId: string,
  datasetId: string,
  date: string,
  fileType: "image.png" | "data.geojson" | "points.geojson"
) => {
  return `${
    import.meta.env.VITE_BASE_URL
  }/output/${regionId}/${datasetId}/${date}/${fileType}`;
};
