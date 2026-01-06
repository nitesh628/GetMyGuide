import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/service/api';
import { AdminPackage } from '@/types/admin';

// Fetches all packages
export const fetchPackages = createAsyncThunk<AdminPackage[]>(
  'admin/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<AdminPackage[]>('/api/packages');
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch packages');
    }
  }
);

// Deletes a package by ID
export const deletePackage = createAsyncThunk<string, string>(
  'admin/deletePackage',
  async (packageId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/api/packages/${packageId}`);
      return packageId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete package');
    }
  }
);

// Adds a new package using FormData
export const addPackage = createAsyncThunk<AdminPackage, FormData>(
  'admin/addPackage',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await apiService.post<AdminPackage>(
        '/api/packages',
        packageData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add new package');
    }
  }
);

// Updates a package using FormData
export const updatePackage = createAsyncThunk<AdminPackage, { id: string; packageData: FormData }>(
  'admin/updatePackage',
  async ({ id, packageData }, { rejectWithValue }) => {
    try {
      // NOTE: We use PUT for full updates. If you only update parts, PATCH is better.
      const response = await apiService.put<AdminPackage>(
        `/api/packages/${id}`,
        packageData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update package');
    }
  }
);

export const fetchPackageById = createAsyncThunk<AdminPackage, string>(
  'packages/fetchById',
  async (packageId, { rejectWithValue }) => {
    try {
      // This assumes you have a backend API endpoint like GET /api/packages/:id
      const response = await apiService.get<AdminPackage>(`/api/packages/${packageId}`);
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch package');
    }
  }
);

interface FetchRecommendedArgs {
  limit?: number;
}

export const fetchRecommendedPackages = createAsyncThunk<AdminPackage[], FetchRecommendedArgs | void>(
  'packages/fetchRecommended',
  async (args, { rejectWithValue }) => {
    try {
      // API URL mein limit query parameter add karein agar woh maujood hai
      const url = args?.limit 
          ? `/api/packages/recommended?limit=${args.limit}` 
          : '/api/packages/recommended';

      const response = await apiService.get<AdminPackage[]>(url);
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch recommended packages');
    }
  }
);
