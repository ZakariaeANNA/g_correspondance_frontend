import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const importationApi = createApi({
  reducerPath: "importationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
  }),
  endpoints: (builder) => ({
    getImportationBycodeGRESA: builder.query({
      query: (codeGRESA) => `api/importations/${codeGRESA}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetImportationBycodeGRESAQuery
} = importationApi;
