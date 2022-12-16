import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movies$ } from '../../client/movies';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async () => await movies$
);

export const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    data: [],
    status: 'idle',
  },
  reducers: {
    remove: (state, action) => {
      state.data = state.data.filter((el) => el.id !== action.payload);
    },
    like: (state, action) => {
      state.data = state.data.map((movie) =>
        movie.id === action.payload
          ? { ...movie, likes: movie.likes + 1 }
          : movie
      );
    },
    dislike: (state, action) => {
      state.data = state.data.map((movie) =>
        movie.id === action.payload
          ? { ...movie, dislikes: movie.dislikes + 1 }
          : movie
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = 'fulfilled';
    });
  },
});
export const { remove, like, dislike } = moviesSlice.actions;
export default moviesSlice.reducer;
