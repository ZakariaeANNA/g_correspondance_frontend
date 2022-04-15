import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/users",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token)
        headers.set('authorization', `Bearer ${token}`);
    return headers;
},
}),
endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (body) => {
      return {
        url: "",
        method: "post",
        body,
      };
    },
    }),
    getAllUsers: builder.query({
      query: () => "",
    }),
    changePassword: builder.mutation({
      query: (data)=>{
        return{
          url: `/changepassword/${data.doti}/${data.password}/${data.currentPassword}`,
          method: "put"
        }
      }
    }),
    updateUser: builder.mutation({
      query: ({body,id})=>{
        return{
          url: `/${id}`,
          method: "put",
          body,
        }
      }
    }),
    resetPassword: builder.mutation({
      query: (data)=>{
        return {
          url: `/resetpassword/${data.doti}/${data.cin}`,
          method: "put"
        }
      }
    }),
    deleteUser: builder.mutation({
      query: (id)=>{
        return {
          url: `/${id}`,
          method: "delete"
        }
      }
    }),
    getCurrentUser: builder.query({
      query: (id)=>{
        return{
          url: `/${id}`,
          method: 'get'
        }
      }
    })
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddUserMutation,
  useGetAllUsersQuery,
  useChangePasswordMutation,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useDeleteUserMutation,
  useGetCurrentUserQuery
} = userApi;
