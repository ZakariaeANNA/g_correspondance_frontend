import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://127.0.0.1:8000/api/departments",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token)
          headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => ``,
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDepartmentsQuery,
} = departmentApi;
