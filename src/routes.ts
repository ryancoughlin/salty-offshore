export const ROUTES = {
  HOME: "/",
  REGION: "/:regionId",
  DATASET: "/:regionId/:datasetId",
  DATE: "/:regionId/:datasetId/:date",
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    VERIFY_EMAIL: "/verify-email"
  },
  ACCOUNT: {
    PROFILE: "/account/profile",
    BILLING: "/account/billing",
    BOAT: "/account/boat"
  }
} as const;
