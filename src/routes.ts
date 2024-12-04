export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  REGION: "/:regionId",
  DATASET: "/:regionId/:datasetId",
  DATE: "/:regionId/:datasetId/:date",
  ACCOUNT: {
    PROFILE: '/account/profile',
    BILLING: '/account/billing',
    BOAT: '/account/boat'
  }
} as const;
