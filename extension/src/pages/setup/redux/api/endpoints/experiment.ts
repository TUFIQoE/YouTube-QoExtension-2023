import { api } from '..';

const experimentAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getNextExperimentID: builder.query({
      query: () => '/experiment/next/id',
    }),
    postExperiment: builder.mutation({
      query: (body) => ({
        url: '/experiment',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetNextExperimentIDQuery, usePostExperimentMutation } =
  experimentAPI;
