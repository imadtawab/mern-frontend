import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import { adminAPI } from '../../API/axios-global'





export const getOrders = createAsyncThunk("getOrders",
  async (_, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.get("/orders"+window.location.search).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const changeOrderStatus = createAsyncThunk("changeOrderStatus",
  async ({_id, status}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.patch("/orders/change-status/"+_id, {status}).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const deleteOrder = createAsyncThunk("deleteOrder",
  async ({id}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.delete("/orders/"+id).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const updateManyOrdersStatus = createAsyncThunk("updateManyOrdersStatus",
  async (body, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.post("/orders/many/update-status", body).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const deleteManyOrders = createAsyncThunk("deleteManyOrders",
  async (itemsSelected, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.post("/orders/many/delete", {itemsSelected}).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const getOrderDetails = createAsyncThunk("getOrderDetails",
  async (id, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.get("/orders/"+id).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const newPersonalNote = createAsyncThunk("newPersonalNote",
  async ({_id, personal_notes}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.patch("/orders/new-personal-note/"+_id, {personal_notes}).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const deleteOrderStatus = createAsyncThunk("deleteOrderStatus",
  async ({_id, index}, thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    return adminAPI.patch("/orders/delete-order-status/"+_id,{index}).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})

export const getOrdersTrackingStatus = createAsyncThunk("getOrdersTrackingStatus",
  async (_, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.get("/orders/tracking-status").then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
})
export const getOrderTrackingDetails = createAsyncThunk("getOrderTrackingDetails",
  async (id, thunkAPI) => {
    const {rejectWithValue} = thunkAPI
    return adminAPI.get("/orders/orders-tracking/details/"+id+window.location.search).then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
  })

  export const dashboard_OrderStatics = createAsyncThunk("dashboard_OrderStatics" , 
    async (_, thunkAPI) => {
      const {rejectWithValue} = thunkAPI
      return adminAPI.get("/orders/dashboard-order-statics").then(docs => docs.data).catch(err => rejectWithValue(err.response.data || err))
      })
// --------------------------------------------------------




const initState = {
    isLoading: false,
    isLoadingPage: false,
    isLoadingSlug: false,
}
const orderSlice = createSlice({
    name: "order",
    initialState: initState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      // GET Orders
      .addCase(getOrders.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // Change Visibility
      .addCase(changeOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
      })
            // Change Visibility
            .addCase(deleteOrderStatus.pending, (state) => {
              state.isLoading = true;
            })
            .addCase(deleteOrderStatus.fulfilled, (state, action) => {
              state.isLoading = false;
            })
            .addCase(deleteOrderStatus.rejected, (state, action) => {
              state.isLoading = false;
            })
      // Change Visibility
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Change Visibility
      .addCase(deleteManyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteManyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteManyOrders.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Change Visibility
      .addCase(updateManyOrdersStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateManyOrdersStatus.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateManyOrdersStatus.rejected, (state, action) => {
        state.isLoading = false;
      })
      // GET Atribute
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // GET newPersonalNote
      .addCase(newPersonalNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(newPersonalNote.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(newPersonalNote.rejected, (state, action) => {
        state.isLoading = false;
      })
      // GET orders tracking
      .addCase(getOrdersTrackingStatus.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getOrdersTrackingStatus.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getOrdersTrackingStatus.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // getOrderTrackingDetails
      .addCase(getOrderTrackingDetails.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(getOrderTrackingDetails.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(getOrderTrackingDetails.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
      // dashboard_OrderStatics
      .addCase(dashboard_OrderStatics.pending, (state) => {
        state.isLoadingPage = true;
      })
      .addCase(dashboard_OrderStatics.fulfilled, (state, action) => {
        state.isLoadingPage = false;
      })
      .addCase(dashboard_OrderStatics.rejected, (state, action) => {
        state.isLoadingPage = false;
      })
    },
})

// export const counterActions = accountSlice.actions
export default orderSlice.reducer