import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';
import { AUTH_CONSTANTS } from '../constants/authConstants';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loading: false,
  errors: {},
  successMessage: '',
  activationStatus: null,
  token: null,
};

// Helper to sync sessionStorage with Redux state
const syncSessionStorage = (isAuthenticated) => {
  if (isAuthenticated) {
    sessionStorage.setItem('isAuthenticated', 'true');
  } else {
    sessionStorage.removeItem('isAuthenticated');
  }
};

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AUTH_CONSTANTS.AUTH_REGISTER, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Registration failed' });
    }
  }
);

export const loginAsync = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(AUTH_CONSTANTS.AUTH_LOGIN, formData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Login failed' });
  }
});

export const activateAccountAsync = createAsyncThunk(
  'auth/activate',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        AUTH_CONSTANTS.AUTH_ACTIVATE.replace(':token', token)
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Activation failed' });
    }
  }
);

export const resendActivationAsync = createAsyncThunk(
  'auth/resendActivation',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AUTH_CONSTANTS.AUTH_RESEND_ACTIVATION, { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to resend activation link' });
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AUTH_CONSTANTS.AUTH_FORGOT_PASSWORD, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to send reset link' });
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        AUTH_CONSTANTS.AUTH_RESET_PASSWORD.replace(':token', token),
        formData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to reset password' });
    }
  }
);

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(AUTH_CONSTANTS.AUTH_LOGOUT);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Logout failed' });
  }
});

export const getMeAsync = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log('Fetching user with getMe');
      const res = await axiosInstance.get(AUTH_CONSTANTS.AUTH_ME);
      return res.data.user;
    } catch (err) {
      console.error('getMe error:', err);
      if (err.status !== 401) {
        dispatch(setAuthChecked(true));
        return rejectWithValue({
          message: err.message || 'Something went wrong',
          status: err.status || 500,
          suppressToast: !err.data,
        });
      }
     
      throw err; 
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log('Calling /refresh endpoint');
      const response = await axiosInstance.post(AUTH_CONSTANTS.AUTH_REFRESH);
      return response.data;
    } catch (err) {
      console.error('Refresh token error:', err);
      dispatch(setAuthChecked(true));
      return rejectWithValue({
        message: err.message || 'Token refresh failed',
        status: err.status || 401,
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages: state => {
      state.errors = {};
      state.successMessage = '';
      state.activationStatus = null;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      syncSessionStorage(false);
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logoutAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(logoutAsync.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.successMessage = 'Logged out successfully';
        syncSessionStorage(false);
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(registerAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(registerAsync.fulfilled, state => {
        state.loading = false;
        state.successMessage = 'Activation link sent to your email';
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(loginAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
        state.activationStatus = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = 'Login successful';
        syncSessionStorage(true);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
        if (action.payload.message === 'Account not activated') {
          state.activationStatus = 'unactivated';
        }
      })
      .addCase(activateAccountAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(activateAccountAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = 'Account activated successfully';
        syncSessionStorage(true);
      })
      .addCase(activateAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(resendActivationAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(resendActivationAsync.fulfilled, state => {
        state.loading = false;
        state.successMessage = 'Activation link resent to your email';
      })
      .addCase(resendActivationAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(forgotPasswordAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(forgotPasswordAsync.fulfilled, state => {
        state.loading = false;
        state.successMessage = 'Reset link sent to your email';
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(resetPasswordAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(resetPasswordAsync.fulfilled, state => {
        state.loading = false;
        state.successMessage = 'Password reset successfully';
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getMeAsync.pending, state => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isAuthChecked = true;
        syncSessionStorage(!!action.payload);
      })
      .addCase(getMeAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAuthChecked = true;
        syncSessionStorage(false);
        if (!action.payload.suppressToast) {
          state.errors = { message: action.payload.message };
        }
      })
      .addCase(refreshTokenAsync.pending, state => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        syncSessionStorage(true);
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAuthChecked = true;
        state.errors = { message: action.payload.message };
        syncSessionStorage(false);
      });
  },
});

export const { clearMessages, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;