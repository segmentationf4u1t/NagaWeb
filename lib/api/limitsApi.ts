import { Endpoints } from "@/conf/cfg";
import { keepCacheFor } from "@/conf/cfg";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Limit } from "@/types/limits";

export const limitsApi = createApi({
	tagTypes: ["Limits"],
	reducerPath: "limitsApi",
	baseQuery: fetchBaseQuery({ baseUrl: Endpoints.NAGA_BASE_URL }),
	endpoints: (builder) => ({
		fetchLimits: builder.query<Limit[], void>({
			query: () => "limits",
			transformResponse: (response: { data: Limit[] }) => response.data,
			providesTags: ["Limits"],
		}),
	}),
	keepUnusedDataFor: keepCacheFor,
});

export const { useFetchLimitsQuery } = limitsApi;
