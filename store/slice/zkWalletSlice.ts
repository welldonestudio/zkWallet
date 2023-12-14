import { createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface Wallet {
  path: string;
  address: string;
  proof?: string;
}

export interface zkWalletState {
  zkWalletState: {
    index: number;
    selected: string;
    wallets: Wallet[];
  };
}

const initialState: zkWalletState = {
  zkWalletState: {
    index: 0,
    selected: '',
    wallets: [],
  },
};

export const zkWalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addWallet(state, action: { type: string; payload: Wallet }) {
      if (
        !state.zkWalletState.wallets.find(
          (item) =>
            item.path === action.payload.path &&
            item.address === action.payload.address,
        )
      ) {
        state.zkWalletState.wallets.push(action.payload);
        state.zkWalletState.index = state.zkWalletState.index + 1;
        state.zkWalletState.selected = action.payload.address;
      }
    },
    selectWallet(state, action: { type: string; payload: Wallet }) {
      if (
        !!state.zkWalletState.wallets.find(
          (item) =>
            item.path === action.payload.path &&
            item.address === action.payload.address,
        )
      ) {
        state.zkWalletState.selected = action.payload.address;
      }
    },
    removeWallet(state, action: { type: string; payload: Wallet }) {
      state.zkWalletState.wallets = state.zkWalletState.wallets.filter(
        (item) =>
          !(
            item.path === action.payload.path &&
            item.address === action.payload.address
          ),
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
