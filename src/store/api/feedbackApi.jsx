import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
  }),
  endpoints: (builder) => ({
    addFeedback: builder.mutation({
      query: (body) => {
        return {
          url: "/feedbacks",
          method: "post",
          body,
        };
      },
    }),
    confirmMailBySender: builder.mutation({
      query: (data) => {
        return {
          url: `/correspondences/confirm/sender/${data.idReceiver}/${data.mail_id}/${data.state}`,
          method: "put",
        };
      },
    }),
    confirmMailByReceiver: builder.mutation({
      query: (data) => {
        return {
          url: `/correspondences/confirm/receiver/${data.idReceiver}/${data.mail_id}/${data.state}`,
          method: "put",
        };
      },
    }),
    getFeedbackByidAndBysender: builder.query({
      query: (data) => `/feedbacks/sent/${data.id}/${data.user}`,
    }),
    getFeedbackByidAndByreceiver: builder.mutation({
        query: (data) => {
          return {
            url: `feedbacks/received/${data.id}/${data.user}`,
            method: "get"
          };
        },
    }),
    getFeedbackBymailAndBysenderAndByreceiver: builder.mutation({
      query: (data) => {
        return {
          url: `/feedbacks/${data.mail}/${data.sender}/${data.receiver}`,
          method: "get"
        };
      },
    }),
    getFeedbackBymailAndBysenderAndByreceiverclone: builder.query({
      query: (data) => `/${data.mail}/${data.sender}/${data.receiver}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddFeedbackMutation,
  useGetFeedbackByidAndByreceiverMutation,
  useGetFeedbackByidAndBysenderQuery,
  useGetFeedbackBymailAndBysenderAndByreceiverMutation,
<<<<<<< HEAD
  useConfirmMailBySenderMutation,
  useConfirmMailByReceiverMutation
=======
  useGetFeedbackBymailAndBysenderAndByreceivercloneQuery
>>>>>>> 77613fcb404adbd46318c265b908f1d8b9c863bc
} = feedbackApi;
