import { createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../store';
import { CRYPTO, PROVIDER } from './config';

export interface AuthState {
  authState:
    | {
        provider: PROVIDER;
        chain: 'sui'; // without network
        jwt?: string;
        maxEpoch: number;
        randomness: string;
        key:
          | {
              crypto: CRYPTO;
              encrypt: string;
              publicKey: string;
              privateKey?: string;
            }
          | undefined;
      }
    | undefined;
}

const initialState: AuthState = {
  authState: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.authState = action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const selectAuthState = (state: AppState) => state.auth.authState;
export default authSlice.reducer;
