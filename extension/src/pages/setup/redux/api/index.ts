import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8080',
  }),
  tagTypes: ['Setup'],
  endpoints: (builder) => ({}),
});
