import { createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../store';
import { CRYPTO, PROVIDER } from './config';

export interface JwtState {
  jwtState:
    | {
        provider: PROVIDER;
        jwt: string;
        maxEpoch: number;
        key:
          | {
              crypto: CRYPTO;
              encrypt: string;
              publicKey?: string;
              privateKey?: string;
            }
          | undefined;
      }
    | undefined;
}

const initialState: JwtState = {
  jwtState: undefined,
};

export const jwtSlice = createSlice({
  name: 'jwt',
  initialState,
  reducers: {
    setJwtState(state, action) {
      state.jwtState = action.payload;
    },
  },
});

export const { setJwtState } = jwtSlice.actions;
export const selectJwtState = (state: AppState) => state.jwt.jwtState;
export default jwtSlice.reducer;
