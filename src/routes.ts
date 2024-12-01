export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  REGION: "/:regionId",
  DATASET: "/:regionId/:datasetId",
  DATE: "/:regionId/:datasetId/:date",
} as const;
