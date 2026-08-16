import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { filesAPI } from '../../api/api';

const initialState = {
  files: [],
  currentFile: null,
  isLoading: false,
  error: null,
  shareLink: null,
};

export const fetchFiles = createAsyncThunk(
  'files/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await filesAPI.list();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ file, comment }, { rejectWithValue }) => {
    try {
      const response = await filesAPI.upload(file, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (id, { rejectWithValue }) => {
    try {
      await filesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const renameFile = createAsyncThunk(
  'files/rename',
  async ({ id, newName }, { rejectWithValue }) => {
    try {
      const response = await filesAPI.rename(id, newName);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'files/addComment',
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const response = await filesAPI.addComment(id, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const shareFile = createAsyncThunk(
  'files/share',
  async (id, { rejectWithValue }) => {
    try {
      const response = await filesAPI.share(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const downloadFile = createAsyncThunk(
  'files/download',
  async (id, { rejectWithValue }) => {
    try {
      const response = await filesAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearShareLink: (state) => {
      state.shareLink = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.unshift(action.payload);
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter((f) => f.id !== action.payload);
      })
      .addCase(renameFile.fulfilled, (state, action) => {
        const index = state.files.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) state.files[index] = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.files.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) state.files[index] = action.payload;
      })
      .addCase(shareFile.fulfilled, (state, action) => {
        state.shareLink = action.payload.share_link;
      });
  },
});

export const { clearShareLink, clearError } = fileSlice.actions;
export default fileSlice.reducer;