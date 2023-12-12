import { createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../store';
import { NETWORK } from './config';

export interface Wallet {
  network: NETWORK;
  path: string;
  address: string;
  proof?: string;
}

export interface zkWalletState {
  zkWalletState: {
    index: number;
    wallets: Wallet[];
  };
}

const initialState: zkWalletState = {
  zkWalletState: {
    index: 0,
    wallets: [],
  },
};

export const zkWalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addWallet(state, action) {
      if (
        !state.zkWalletState.wallets.find(
          (item) => item.path === action.payload.path,
        )
      ) {
        state.zkWalletState.wallets.push(action.payload);
        state.zkWalletState.index = state.zkWalletState.index + 1;
      }
    },
    removeWallet(state, action) {
      state.zkWalletState.wallets = state.zkWalletState.wallets.filter(
        (item) => item.path !== action.payload.path,
      );
    },
    resetWallet(state) {
      state.zkWalletState.wallets = [];
      state.zkWalletState.index = 0;
    },
  },
});

export const { addWallet, removeWallet, resetWallet } = zkWalletSlice.actions;
export const selectWalletState = (state: AppState) =>
  state.wallet.zkWalletState;
export default zkWalletSlice.reducer;
