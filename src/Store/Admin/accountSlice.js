import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import { adminAPI } from '../../API/axios-global'
import { avatarHandle } from "../../Admin/Utils/accountUtils"

export const registerAccount = createAsyncThunk("registerAccount" ,
  async (user, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.post("/account/register",user)
      .then(docs => {
        console.log(data, 11)
        return docs.data
      })
      .catch(err => {
        console.log(err, 22)
        return rejectWithValue(err.response.data || err)
      })
  })
export const resendEmail = createAsyncThunk("resendEmail" ,
  async (email, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.post("/account/register/resend-email",{email})
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
})

export const confirmEmail = createAsyncThunk("confirmEmail" ,
  async (activationCode, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.post("/account/register/confirm-email/"+activationCode)
    .then(docs => docs.data)
    .catch(err => rejectWithValue(err.response.data || err))
})
export const loginAccount = createAsyncThunk("loginAccount" ,
  async (user, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.post("/account/login",user)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
})
export const forgotPassword = createAsyncThunk("forgotPassword" ,
  async (email, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.post("/account/login/forgot-password",{email})
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
})
export const forgotChangePassword = createAsyncThunk("forgotChangePassword" ,
  async ({forgotPasswordCode, passwords}, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.post("/account/login/forgot-password/"+forgotPasswordCode,passwords)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
})
export const addAuthToState = createAsyncThunk("addAuthToState",
  async (_auth, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.get("/account/auth/addAuthToState",{
      headers: {"Authorization" : _auth},
    }).then(docs => docs.data)
    .catch(err => rejectWithValue(err.response.data || err))
  })

export const logoutAccount = createAsyncThunk("logoutAccount",
  async () => {
    return true
  })
export const updateProfile = createAsyncThunk("updateProfile" ,
  async (body, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.post("/account/settings/update-profile",body)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
})
export const changePassword = createAsyncThunk("changePassword" ,
  async (body, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.put("/account/settings/change-password",body)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
})

const changeStoreNameReducer = ( state = initState , action ) => {
	// Logic
    if( action.type === "account/changeStoreName" ) {
        return {
          ...state,
          user: {
            ...state?.user,
            storeOwner: action.payload
          }
        }
    }
    return state
}

const initState = {
    user: null, 
    isLoading: false,
    isLoadingPage: false
}
const accountSlice = createSlice({
    name: "account",
    initialState: initState,
    reducers: {
      changeStoreName: changeStoreNameReducer
    },
    extraReducers: (builder) => {
      builder
      // Register Account
      .addCase(registerAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Resend Email
      .addCase(resendEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendEmail.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(resendEmail.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Confirm Email
      .addCase(confirmEmail.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // Login Account
      .addCase(loginAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload)
        state.user = {
          ...action.payload.user,
          avatar: avatarHandle(action.payload.user.avatar)
        }
        console.log(action.payload.user)
      })
      .addCase(loginAccount.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Login Account
      .addCase(addAuthToState.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(addAuthToState.fulfilled, (state, action) => {
        state.isLoadingPage = false;
        state.user = {
          ...action.payload.user,
          avatar: avatarHandle(action.payload.user.avatar)
        }
      })
      .addCase(addAuthToState.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Forgot Change Password
      .addCase(forgotChangePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotChangePassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(forgotChangePassword.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Logout Account
      .addCase(logoutAccount.fulfilled, (state, action) => {
        state.user = null
      })
            .addCase(updateProfile.pending, (state) => {
              state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
              state.isLoading = false;
              console.log(action);
              state.user = {
                ...state.user,
                ...action.payload.data,
                avatar: avatarHandle(action.payload.data?.avatar)
              }
            })
            .addCase(updateProfile.rejected, (state, action) => {
              state.isLoading = false;
            })
                  // changePassword
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
      })
    },
})

export const accountActions = accountSlice.actions
export default accountSlice.reducer
