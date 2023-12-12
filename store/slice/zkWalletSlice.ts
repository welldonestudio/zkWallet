import { createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface Wallet {
  path: string;
  address: string;
  proof?: string;
}

export interface zkWalletState {
  zkWalletState: Wallet[];
}

const initialState: zkWalletState = {
  zkWalletState: [],
};

export const zkWalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addWallet(state, action) {
      !state.zkWalletState.find((item) => item.path === action.payload.path) &&
        state.zkWalletState.push(action.payload);
    },
    removeWallet(state, action) {
      state.zkWalletState = state.zkWalletState.filter(
        (item) => item.path !== action.payload.path,
      );
    },
    reset(state, action) {
      state.zkWalletState = action.payload || [];
    },
  },
});

export const { addWallet, removeWallet } = zkWalletSlice.actions;
export const selectWalletState = (state: AppState) =>
  state.wallet.zkWalletState;
export default zkWalletSlice.reducer;
