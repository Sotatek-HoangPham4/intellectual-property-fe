import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/core/application/mapper/authMapper";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isTokenExpired: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; accessToken: string | null }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isTokenExpired = false;
    },
    setAuthenticated: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isTokenExpired = false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setTokenExpired: (state, action: PayloadAction<boolean>) => {
      state.isTokenExpired = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isTokenExpired = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isTokenExpired = true;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
  },
});

export const {
  setCredentials,
  setAuthenticated,
  setAccessToken,
  setTokenExpired,
  clearCredentials,
  logout,
  updateUserName,
} = authSlice.actions;

export default authSlice.reducer;
