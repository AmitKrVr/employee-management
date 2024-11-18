import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import employeeReducer from "./employeeSlice";

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
  },
});

export default appStore;
