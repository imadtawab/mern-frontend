import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import { clientAPI } from '../../API/axios-global'

export const getProducts = createAsyncThunk("getProducts",
  async (_, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return clientAPI.get("/products").then(docs => docs.data).catch(err => {
      console.log(err)
      rejectWithValue(err?.response?.data || err)
    })
})
export const getProductsFilter = createAsyncThunk("getProductsFilter",
  async (_, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return clientAPI.get("/products"+window.location.search).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
// WISHLIST
export const getWishList = createAsyncThunk("getWishList",
  async (_, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    let wishlist = JSON.parse(localStorage.getItem("WISH_LIST")) || []
    return clientAPI.post("/products/wishlist", {wishlist}).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const getProductDetails = createAsyncThunk("getProductDetails",
  async (slug, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return clientAPI.get("/products/"+slug).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
  }
)
export const addCustomerReview = createAsyncThunk("addCustomerReview",
  async ({_id, body}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return clientAPI.post("/products/reviews/"+_id, body).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
  }
)


const initState = {
    isLoading: false,
    isLoadingPage: false,
    isLoadingProduct: false,
    isLoadingFilter: false
}
const client_productSlice = createSlice({
    name: "client_product",
    initialState: initState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      // GET Products
      .addCase(getProducts.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // GET Products
      .addCase(getWishList.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getWishList.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getWishList.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // GET Product
      .addCase(getProductDetails.pending, (state) => {
        state.isLoadingProduct = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.isLoadingProduct = false;
      })
      // getProductsFilter
      .addCase(getProductsFilter.pending, (state) => {
        state.isLoadingFilter = true;
      })
      .addCase(getProductsFilter.fulfilled, (state, action) => {
        state.isLoadingFilter = false;
      })
      .addCase(getProductsFilter.rejected, (state, action) => {
        state.isLoadingFilter = false;
      })
      // addCustomerReview
      .addCase(addCustomerReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCustomerReview.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addCustomerReview.rejected, (state, action) => {
        state.isLoading = false;
      })
    },
})
export default client_productSlice.reducer