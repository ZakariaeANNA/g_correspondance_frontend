import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
  }),
  endpoints: (builder) => ({
    getFeedbackByidAndBysender: builder.query({
      query: (data) => `feedbacks/sent/${data.id}/${data.user}`,
    }),
    getFeedbackByidAndByreceiver: builder.mutation({
        query: (data) => {
          return {
            url: `feedbacks/received/${data.id}/${data.user}`,
            method: "get"
          };
        },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFeedbackByidAndByreceiverMutation,
  useGetFeedbackByidAndBysenderQuery
} = feedbackApi;
