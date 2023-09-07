import React, {Component, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import InvoiceForm from "./components/InvoiceForm";
import Bills from "./components/Bills";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import {updateInvoiceStateFromStorage} from "./store/slices/InvoiceSliceReducer";
import {useDispatch} from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  useEffect(()=> {
    const invoiceState = localStorage.getItem('invoiceState');
    if(invoiceState){
      dispatch(updateInvoiceStateFromStorage(JSON.parse(invoiceState)));
    }
  },[])
    return (
      <div
        className="App d-flex flex-column
      align-items-center justify-content-center w-100"
      >
        <Container>
          <Navbar />
          <Routes>
            <Route path="/invoice" element={<Bills />}></Route>
            <Route path="/invoice/create" element={<InvoiceForm />}></Route>
            <Route path="/invoice/edit/:id" element={<InvoiceForm />}></Route>
          </Routes>
        </Container>
        <ToastContainer />
      </div>
    );
}

export default App;
