// src/store/api/apiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../middlewares/baseQueryWithReauth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Chart",
    "Organization",
    "Document",
    "Role",
    "Signature",

    // AIC
    "Portfolio",
    "Holding",
    "Dashboard",
    "RiskReport",
    "Scenario",
    "CopilotSession",
    "CopilotMessage",
    "CopilotRun",

    // ADMIN
    "AdminMetrics",
    "AdminUser",
    "AdminPortfolio",
    "AdminCopilot",
    "AdminRisk",
    "AdminSettings",
  ],
  endpoints: () => ({}),
});
