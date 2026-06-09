import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

export const fetchActivities =
  createAsyncThunk(
    "activities/fetch",
    async () => {
      const response = await fetch(
        `https://dummyjson.com/users`
      );
      console.log("fetchActivities response =>", response);
      return response.json();
    }
  );

const activitySlice = createSlice({
  name: "activities",

  initialState: {
    data: [],
    loading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchActivities.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchActivities.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      );
  },
});

export default activitySlice.reducer;