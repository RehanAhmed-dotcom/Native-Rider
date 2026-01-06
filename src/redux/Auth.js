import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  usertype: null,
  riderCredentials: {
    email: '',
    password: '',
    rememberMe: false,
  },
  driverCredentials: {
    email: '',
    password: '',
    rememberMe: false,
  },
};
const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setUserType: (state, action) => {
      state.usertype = action.payload;
    },
    setRiderCredentials: (state, action) => {
      const { email, password, rememberMe } = action.payload;
      state.riderCredentials = { email, password, rememberMe };
    },
    setDriverCredentials: (state, action) => {
      const { email, password, rememberMe } = action.payload;
      state.driverCredentials = { email, password, rememberMe };
    },
    clearRiderCredentials: (state) => {
      state.riderCredentials = { email: '', password: '', rememberMe: false };
    },
    clearDriverCredentials: (state) => {
      state.driverCredentials = { email: '', password: '', rememberMe: false };
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.usertype = null;
    },
  },
});

export const {
  setUser,
  setUserType,
  setRiderCredentials,
  setDriverCredentials,
  clearRiderCredentials,
  clearDriverCredentials,
  logoutUser,
} = UserSlice.actions;
export default UserSlice.reducer;
