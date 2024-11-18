import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const createEmployee = createAsyncThunk(
  "employees/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/employees", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create employee" }
      );
    }
  }
);

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/employees");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch employees"
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/employees/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Update error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update employee" }
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/employees/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete employee"
      );
    }
  }
);

export const toggleEmployeeStatus = createAsyncThunk(
  "employees/toggleStatus",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/employees/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to toggle employee status" }
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: {
      data: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.data.findIndex(
          (emp) => emp._id === action.payload._id
        );
        if (index !== -1) {
          state.list.data[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data = state.list.data.filter(
          (emp) => emp._id !== action.payload._id
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Employee Status
      .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;
        if (state.list.data) {
          state.list.data = state.list.data.map((emp) =>
            emp._id === updatedEmployee._id ? updatedEmployee : emp
          );
        }
      });
  },
});

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
