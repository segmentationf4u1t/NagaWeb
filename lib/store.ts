import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { limitsApi } from "./api/limitsApi";
import { modelsApi } from "./api/modelsApi";
import menuOpenReducer from "./features/isMenuOpen/isMenuOpenSlice";
import screenSizeReducer from "./features/screenSize/screenSizeSlice";

import { evaluationsApi } from "./api/evaluationsApi";

export const makeStore = () => {
	const store = configureStore({
		reducer: {
			screenSize: screenSizeReducer,
			isMenuOpen: menuOpenReducer,
			[modelsApi.reducerPath]: modelsApi.reducer,
			[limitsApi.reducerPath]: limitsApi.reducer,
			evaluationsApi: evaluationsApi.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: ["your-action-type"],
				},
				immutableCheck: process.env.NODE_ENV === "development",
			}).concat(
				modelsApi.middleware,
				limitsApi.middleware,
				evaluationsApi.middleware,
			),
		devTools: process.env.NODE_ENV !== "production",
	});

	// Set up listeners for RTK Query
	setupListeners(store.dispatch);

	return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
