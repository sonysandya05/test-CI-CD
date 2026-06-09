import { configureStore } from "@reduxjs/toolkit";
import detailedViewReducer from "./slices/detailedViewSlice";
import activityViewReducer from "./slices/activitySlice";

export const store = configureStore({
  reducer: {
    detailedView: detailedViewReducer,
    activities: activityViewReducer,
  },
 // Debugging log
});