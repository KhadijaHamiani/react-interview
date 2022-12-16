import { configureStore } from "@reduxjs/toolkit";
import reducers from "../store/reducers";

export const store = configureStore({
  reducer: { movies: reducers }
});
