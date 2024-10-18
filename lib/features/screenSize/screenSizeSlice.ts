// features/screenSize/screenSizeSlice.ts

//
// I dont know what i thought when i wrote this code, and how i wanted it to function but its huge hack and redundant
// It should be burned down
//
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ScreenSizeState {
	isMobile: boolean;
}

const initialState: ScreenSizeState = {
	isMobile: false,
};

const screenSizeSlice = createSlice({
	name: "screenSize",
	initialState,
	reducers: {
		setMobile: (state, action: PayloadAction<boolean>) => {
			state.isMobile = action.payload;
		},
	},
});

export const { setMobile } = screenSizeSlice.actions;
export default screenSizeSlice.reducer;
