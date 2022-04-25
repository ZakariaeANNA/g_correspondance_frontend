import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isExpired } from "react-jwt";


// Define a service using a base URL and expected endpoints
export const importationApi = createApi({
  reducerPath: "importationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/correspondences",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token"); 
        if (token && !isExpired(token))
            headers.set('authorization', `Bearer ${token}`);
        else if(isExpired(token)){

        }
        return headers;
    },
  }),
  endpoints: (builder) => ({
    getImportationByCodeDoti: builder.query({
      query: ({doti , page : pageDefault = 1}) => `receiver/${doti}?page=${pageDefault}`,
    }),
    deleteImportation: builder.mutation({
      query: (id)=>{
        return{
          url:`/delete/${id}`,
          method: "delete"
        }
      }
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetImportationByCodeDotiQuery,
  useDeleteImportationMutation
} = importationApi;
