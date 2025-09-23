'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

const GuestAuthResponseSchema = z
  .object({
    isAuthenticated: z.boolean(),
    user: z
      .object({
        name: z.string().min(1),
        email: z.email(),
        image: z.url().readonly(),
      })
      .readonly(),
  })
  .readonly();

const StaffAuthResponseSchema = z.object({
  isAuthenticated: z.boolean(),
  user: z
    .object({
      userId: z.string(),
      email: z.email(),
      fullName: z.string(),
      avatarUrl: z.url(),
    })
    .readonly(),
});

type GuestAuthResponse = z.infer<typeof GuestAuthResponseSchema>;
type StaffAuthResponse = z.infer<typeof StaffAuthResponseSchema>;

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['GuestAuth', 'StaffAuth'],
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 900,
  endpoints: builder => ({
    getGuestAuth: builder.query<GuestAuthResponse, void>({
      query: () => ({
        url: '/session/guest',
        method: 'GET',
      }),
      transformResponse: response => GuestAuthResponseSchema.parse(response),
      providesTags: result =>
        result ? [{ type: 'GuestAuth', id: 'CURRENT' }] : [],
    }),

    getStaffAuth: builder.query<StaffAuthResponse, void>({
      query: () => '/session/staff',
      transformResponse: response => StaffAuthResponseSchema.parse(response),
      providesTags: result =>
        result ? [{ type: 'StaffAuth', id: 'CURRENT' }] : [],
    }),
  }),
});

export const { useGetGuestAuthQuery, useGetStaffAuthQuery } = authApi;
export default authApi;
