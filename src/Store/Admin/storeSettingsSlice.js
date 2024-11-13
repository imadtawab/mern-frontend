import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import { adminAPI } from '../../API/axios-global'
export const getStoreDetails = createAsyncThunk("getStoreDetails" ,
  async (user, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.get("/store-settings/store-details",user)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
  })
export const updateStoreDetails = createAsyncThunk("updateStoreDetails" ,
async (user, thunkAPI) => {
    const {rejectWithValue, dispatch} = thunkAPI
    return adminAPI.post("/store-settings/store-details",user)
    .then(docs => {
      dispatch({
        type : "account/changeStoreName" ,
        payload : docs.data.data 
      })
      return docs.data
    })
    .catch(err => rejectWithValue(err.response.data || err))
})
export const getSocialMedia = createAsyncThunk("getSocialMedia" ,
  async (user, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.get("/store-settings/social-media",user)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
  })
export const updateSocialMedia = createAsyncThunk("updateSocialMedia" ,
async (user, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.post("/store-settings/social-media",user)
    .then(docs => docs.data)
    .catch(err => rejectWithValue(err.response.data || err))
})
export const getAddress = createAsyncThunk("getAddress" ,
  async (user, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.get("/store-settings/address",user)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
  })
export const updateAddress = createAsyncThunk("updateAddress" ,
async (user, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.post("/store-settings/address",user)
    .then(docs => docs.data)
    .catch(err => rejectWithValue(err.response.data || err))
})
 
const initState = {
    isLoading: false,
    isLoadingPage: false,
    darkMode: false
}
const themeModeReducer = ( state = initState , action ) => {
	// Logic
    // if( action.type === "themeMode/change" ) {
        localStorage.setItem("THEME_MODE",action.payload ? "darkmode" : "lightmode")
        return {
            ...state,
            darkMode: action.payload,
        }
    // }
    // return state
}
const storeSettingsSlice = createSlice({
    name: "store_settings",
    initialState: initState,
    reducers: {
      changeThemeMode: themeModeReducer,
  },
    extraReducers: (builder) => {
      builder
      // getStoreDetails
      .addCase(getStoreDetails.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getStoreDetails.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getStoreDetails.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // updateStoreDetails
      .addCase(updateStoreDetails.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(updateStoreDetails.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateStoreDetails.rejected, (state, action) => {
        state.isLoading = false;
      })
      // getSocialMedia
      .addCase(getSocialMedia.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getSocialMedia.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getSocialMedia.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // updateStoreDetails
      .addCase(updateSocialMedia.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateSocialMedia.rejected, (state, action) => {
        state.isLoading = false;
      })
      // getAddress
      .addCase(getAddress.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // updateStoreDetails
      .addCase(updateAddress.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
      })
    },
})

export const storeSettingsActions = storeSettingsSlice.actions
export default storeSettingsSlice.reducer