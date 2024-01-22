import { createSlice } from '@reduxjs/toolkit';

import type { CRYPTO, NETWORK, PROVIDER, TYPE } from './config';
import type { AppState } from '../store';

export interface Auth {
  provider: PROVIDER;
  network: NETWORK;
  jwt?: string;
  email?: string;
  picture?: string;
  maxEpoch: number;
  randomness: string;
  key: {
    type: TYPE;
    crypto: CRYPTO;
    encrypt?: string;
    publicKey: string;
  };
}

interface AuthState {
  authState: Auth | undefined;
}

const initialState: AuthState = {
  authState: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: { type: string; payload: Auth | undefined }) {
      state.authState = action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const selectAuthState = (state: AppState) =>
  state.auth.authState as Auth | undefined;
export default authSlice.reducer;
