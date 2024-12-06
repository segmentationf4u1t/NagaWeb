import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				console.log("Rate limit exceeded");
			}
		},
	},
});

export const { signUp, signIn, signOut, useSession, getSession } = client;
