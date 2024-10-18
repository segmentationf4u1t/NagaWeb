import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SavingCostsState {
  apiCalls: number;
  inputTokens: number;
  outputTokens: number;
}

const initialState: SavingCostsState = {
  apiCalls: 1000,
  inputTokens: 1000,
  outputTokens: 1000,
};

const savingCostsSlice = createSlice({
  name: 'savingCosts',
  initialState,
  reducers: {
    setApiCalls: (state, action: PayloadAction<number>) => {
      state.apiCalls = action.payload;
    },
    setInputTokens: (state, action: PayloadAction<number>) => {
      state.inputTokens = action.payload;
    },
    setOutputTokens: (state, action: PayloadAction<number>) => {
      state.outputTokens = action.payload;
    },
  },
});

export const { setApiCalls, setInputTokens, setOutputTokens } = savingCostsSlice.actions;
export default savingCostsSlice.reducer;