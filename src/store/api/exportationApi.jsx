import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const exportationApi = createApi({
  reducerPath: "exportationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/correspondences",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
  }),
  endpoints: (builder) => ({
    addExportations: builder.mutation({
      query: (body) => {
        return {
          url: "",
          method: "post",
          body,
        };
      },
    }),
    getExportationBycodeGRESA: builder.query({
        query: ({doti , page : pageDefault = 1}) => `/sender/${doti}?page=${pageDefault}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddExportationsMutation,
  useGetExportationBycodeGRESAQuery,
  useGetExportationByidAndByreceiverMutation
} = exportationApi;
