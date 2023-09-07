import { createSlice } from "@reduxjs/toolkit";
import {initialInvoice} from "./constant"
import {json} from "react-router-dom";
const InvoiceSlice = createSlice({
  name: "invoiceSlice",
  initialState: {
    invoices: [],
    invoiceCount: 0,
    EditThisInvoice: null
  },

  reducers: {
    checkCurrency: (state, action) => {
      const { key, value,invoiceFormId } = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId)
        invoiceElem[key] = value;
      }else {
        state.invoices[state.invoiceCount][key] = value;
      }
    },

    editFieldReducer: (state, action) => {
      const { name, value,invoiceFormId } = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId)
        invoiceElem[name] = value;
      }else {
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount][name] = value;
      }
    },

    itemizedItemEditReducer: (state, action) => {
      const { updatedItems , invoiceFormId} = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId)
        invoiceElem["items"] = updatedItems;
      }else {
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount]["items"] = updatedItems;
      }
    },
    rowAddReducer: (state, action) => {
      const { items,invoiceFormId } = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId)
        invoiceElem["items"] = items;
      }else {
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount]["items"] = items;
      }
    },

    rowDeleteReducer: (state, action) => {
      const { updatedItems,invoiceFormId } = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId)
        invoiceElem["items"] = updatedItems;
      }else {
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount]["items"] = updatedItems;
      }
    },

    calculateTotalReducer: (state, action) => {
      const { subTotal, taxAmount, discountAmount, total,invoiceFormId } = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId)
        invoiceElem.subTotal = subTotal;
        invoiceElem.taxAmount = taxAmount;
        invoiceElem.discountAmount = discountAmount;
        invoiceElem.total = total;
      }else {
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount].subTotal = subTotal;
        state.invoices[state.invoiceCount].taxAmount = taxAmount;
        state.invoices[state.invoiceCount].discountAmount = discountAmount;
        state.invoices[state.invoiceCount].total = total;
      }
    },

    modalReducer: (state, action) => {
      const { invoiceFormId,isOpen} = action.payload;
      if(invoiceFormId){
        const invoiceElem = state.invoices.find((ele)=> ele.id.toString() === invoiceFormId);
        if(invoiceElem) {
          invoiceElem.isOpen = isOpen
        }
      }else {
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount].isOpen = isOpen;
      }
    },

    deleteInvoiceReducer: (state, action) => {
      const { invoiceId } = action.payload;
      const indexToDelete = state.invoices.findIndex(
        (invoice) => invoice.id === invoiceId
      );
      state.invoices.splice(indexToDelete, 1);
      state.invoiceCount--;
    },
    updateInvoiceStateFromStorage: (state, action) => {
      return action.payload
    },
    editInvoiceReducer:(state,action)=>{
      // const {invoiceId}=action.payload;
      state.EditThisInvoice=action.payload;
    },

    saveInvoiceReducer: (state, action) => {

        // Set a new ID for the saved invoice
        state.invoices[state.invoiceCount] = state.invoices[state.invoiceCount] || initialInvoice;
        state.invoices[state.invoiceCount].id = Date.now(); // invoice number ko hi id bnade kya??

        // Create a new empty invoice object
        const newEmptyInvoice = {
          ...initialInvoice,
          invoiceNumber: state.invoices[state.invoiceCount].invoiceNumber + 1,
        }

        // empty ko push krdia
        state.invoices.push(newEmptyInvoice);

        // Increment the invoice count for the next invoice
        state.invoiceCount++;

      // push into local storage
      localStorage.setItem('invoiceState',JSON.stringify(state))
    },
  },
});
export const {
  checkCurrency,
  editFieldReducer,
  rowDeleteReducer,
  itemizedItemEditReducer,
  rowAddReducer,
  calculateTotalReducer,
  modalReducer,
  deleteInvoiceReducer,
  updateInvoiceStateFromStorage,
  saveInvoiceReducer,
  editInvoiceReducer
} = InvoiceSlice.actions;

export default InvoiceSlice.reducer;
