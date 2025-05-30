import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';
import { AUTH_CONSTANTS } from '../constants/authConstants';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  errors: {},
  successMessage: '',
  activationStatus: null, // Tracks if account is unactivated
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

export const getMeAsync = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(AUTH_CONSTANTS.AUTH_ME);
    return res.data.user;
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        const refreshRes = await axiosInstance.post(AUTH_CONSTANTS.AUTH_REFRESH);
        return refreshRes.data.user;
      } catch (refreshErr) {
        return rejectWithValue(refreshErr.response?.data?.message || 'Session expired');
      }
    }
    return rejectWithValue(err.response?.data?.message || 'Something went wrong');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages: state => {
      state.errors = {};
      state.successMessage = '';
      state.activationStatus = null;
    },
  },
  extraReducers: builder => {
    builder
      // Register
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
      // Login
      .addCase(loginAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
        state.activationStatus = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.successMessage = 'Login successful';
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
        if (action.payload.message === 'Account not activated') {
          state.activationStatus = 'unactivated';
        }
      })
      // Activate
      .addCase(activateAccountAsync.pending, state => {
        state.loading = true;
        state.errors = {};
        state.successMessage = '';
      })
      .addCase(activateAccountAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.successMessage = 'Account activated successfully';
      })
      .addCase(activateAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      // Resend Activation
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
      // Forgot Password
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
      // Reset Password
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
      // Get Me
      .addCase(getMeAsync.pending, state => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMeAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.errors = { message: action.payload };
      });
  },
});

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;
