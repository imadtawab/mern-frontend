import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import { clientAPI } from '../../API/axios-global'

export const getStoreSettings = createAsyncThunk("getStoreSettings" ,
  async (user, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return clientAPI.get("/store-settings",user)
      .then(docs => docs.data)
      .catch(err => rejectWithValue(err.response.data || err))
  })

const initState = {
    isLoading: false,
    isLoadingPage: false,
    social_media: null
}
const client_storeSettingsSlice = createSlice({
    name: "client_settings",
    initialState: initState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      // getStoreSettings
      .addCase(getStoreSettings.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getStoreSettings.fulfilled, (state, action) => {
        state.social_media = action.payload.data?.social_media
        state.isLoadingPage = false;
      })
      .addCase(getStoreSettings.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
    },
})

// export const counterActions = client_storeSettingsSlice.actions
export default client_storeSettingsSlice.reducer