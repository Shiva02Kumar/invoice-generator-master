import { configureStore } from "@reduxjs/toolkit";
import InvoiceSliceReducer from "./slices/InvoiceSliceReducer";

const Store = configureStore({
  reducer: {
    InvoiceSlice: InvoiceSliceReducer,
  },
});

export default Store;

