'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

const responseSchema = z.object({
  isAuthenticated: z.boolean().readonly(),
  user: z.object({
    name: z.string().min(1).readonly(),
    email: z.email(),
    image: z.url().readonly(),
  }),
});

type Response = z.infer<typeof responseSchema>;

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Auth'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getAuth: builder.query<Response, void>({
      query: () => ({
        url: '/session',
        method: 'GET',
      }),
      keepUnusedDataFor: 300,
      transformResponse: response => responseSchema.parse(response),
      providesTags: result => (result ? [{ type: 'Auth', id: 'CURRENT' }] : []),
    }),
  }),
});

export const { useGetAuthQuery } = authApi;
export default authApi;
