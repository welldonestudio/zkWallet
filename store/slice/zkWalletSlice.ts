import { createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface Wallet {
  path: string;
  address: string;
  proof?: string;
}

export interface zkWalletState {
  index: number;
  selected: string;
  wallets: Wallet[];
}

const initialState: zkWalletState = {
  index: 0,
  selected: '',
  wallets: [],
};

export const zkWalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addWallet(state, action: { type: string; payload: Wallet }) {
      if (
        !state.wallets.find((item) => item.address === action.payload.address)
      ) {
        state.wallets.push(action.payload);
        state.index = state.index + 1;
        state.selected = action.payload.address;
      }
    },
    selectWallet(state, action: { type: string; payload: Wallet }) {
      if (
        !!state.wallets.find((item) => item.address === action.payload.address)
      ) {
        state.selected = action.payload.address;
      }
    },
    removeWallet(state, action: { type: string; payload: Wallet }) {
      state.wallets = state.wallets.filter(
        (item) => !(item.address === action.payload.address),
      );
    },
    resetWallet(state) {
      state.wallets = [];
      state.selected = '';
      state.index = 0;
    },
  },
});

export const { addWallet, removeWallet, resetWallet } = zkWalletSlice.actions;
export const selectWalletState = (state: AppState) =>
  state.wallet as zkWalletState;
export default zkWalletSlice.reducer;
