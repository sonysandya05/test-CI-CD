import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getJobDetailedView } from "../../services/jobsApi";

export const fetchDetailedView = createAsyncThunk(
  "detailedView/fetchDetailedView",
  async ({ module, id }, thunkAPI) => {
    try {
      const response = await getJobDetailedView(
        module,
        id
      );
      return {
        module,
        data: response.data,
      };
    } catch (error) {
      console.error(error);

      return thunkAPI.rejectWithValue(
        error.response?.data ||
          error.message
      );
    }
  }
);

const detailedViewSlice = createSlice({
  name: "detailedView",

  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDetailedView.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDetailedView.fulfilled,
        (state, action) => {
          state.loading = false;

          console.log(
            "FULL PAYLOAD yes =>",
            action.payload
          );

          const moduleKeyMap = {
            jobs: "jobDetailedView",
            candidates:
              "candidatesDetailedView",
            submission:
              "submissionsDetailedView",
          };

          const key =
            moduleKeyMap[
              action.payload.module
            ];

          state.data =
            action.payload.data[key] || [];
        }
      )

      .addCase(
        fetchDetailedView.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;

          console.log(
            "ERROR =>",
            action.payload
          );
        }
      );
  },
});

export default detailedViewSlice.reducer;