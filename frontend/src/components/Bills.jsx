import React, { useEffect, useState } from "react";
import { Container, Typography, Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WifiProtectedSetupIcon from "@mui/icons-material/WifiProtectedSetup";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInvoiceReducer,
  updateInvoiceStateFromStorage,
  editInvoiceReducer,
} from "../store/slices/InvoiceSliceReducer";
import InvoiceModal from "./InvoiceModal";
import InvoiceForm from "./InvoiceForm";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

const Bills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { invoices } = useSelector((state) => state.InvoiceSlice);

  // async function getInvoicesDB(){
  //   await fetch("http://localhost:5000/invoice", {
  //     method: "GET"
  //   })
  //     .then((response) => response.json())
  //     .then((data) => setResponseData(data))
  //     .catch((error) => console.error('Error:', error));
  // }

  const [responseData, setResponseData] = useState();
  // const invoices = responseData;

  useEffect(() => {
    // Define the async function inside the useEffect
    async function getInvoicesDB() {
      try {
        // const response = await fetch("http://localhost:5000/invoice", {
        //   method: "GET"
        // });
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        // const data = await response.json();
        const response = await axios.get('http://localhost:5000/invoice')
          .then((response) => {
            const data = response.data;
            console.log(data);
            console.log(typeof(data));
            console.log(data.dataFromDB);
            console.log(typeof(data.dataFromDB));
            console.log(invoices)
            setResponseData(data.dataFromDB);
          })
          .catch((error) => console.error('Error:', error));
        // console.log(typeof (data.dataFromDB[1]))
        // console.log(data.dataFromDB)
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // Call the async function
    getInvoicesDB();
  }, []);

  // const [responseData, setResponseData] = useState(null);


  const [selectedViewInvoiceId, setSelectedViewInvoiceId] = useState(null);

  const deleteInvoice = (invoiceId) => {
    dispatch(deleteInvoiceReducer({ invoiceId }));
  };

  const handleViewInvoice = (invoiceId) => {
    setSelectedViewInvoiceId(invoiceId);
  };

  const handleEditInvoice = (invoiceId) => {
    navigate(`/invoice/edit/${invoiceId}`);
  };


  return (
    <>
      <Container sx={{ backgroundColor: "white", marginTop: "10px" }}>
        <Typography align="center">LIST OF INVOICES</Typography>
        <>
          {responseData.map((ele) => {
            return (
              ele.id && (
                <Box
                  key={ele.id}
                  className="horizontal"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  sx={{
                    backgroundColor: isHovered ? "rgba(0,0,0,.07)" : "inherit",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    className="leftSide"
                    sx={{ padding: "10px" }}
                  >
                    <Box>
                      <Typography m="2">🧾</Typography>
                    </Box>
                    <Box textAlign="center" sx={{ marginLeft: "15px" }}>
                      <Typography>{ele.billTo}</Typography>
                      <Typography size="large">{ele.dateOfIssue}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" className="rightSide">
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        sx={{ marginRight: "5px" }}
                      >
                        <DeleteIcon
                          fontSize="large"
                          color="warning"
                          onClick={() => {
                            deleteInvoice(ele.id);
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="view">
                      <IconButton aria-label="view" sx={{ marginRight: "5px" }}>
                        <VisibilityIcon
                          fontSize="large"
                          color="info"
                          onClick={() => {
                            handleViewInvoice(ele.id);
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    {/* <Link style={{ textDecoration: "none" }} to="/InvoiceForm"> */}
                    <Tooltip title="edit">
                      <IconButton aria-label="edit" sx={{ marginRight: "5px" }}>
                        <WifiProtectedSetupIcon
                          fontSize="large"
                          color="secondary"
                          onClick={() => {
                            handleEditInvoice(ele.id);
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    {/* </Link> */}

                    <Typography textAlign="center" sx={{ marginRight: "15px" }}>
                      {ele.total}
                    </Typography>
                  </Box>
                  {/* </Box> */}
                  <Divider />
                </Box>
              )
            );
          })}
        </>
      </Container>
      {selectedViewInvoiceId && (
        <InvoiceModal
          showModal={true}
          closeModal={() => setSelectedViewInvoiceId(null)}
          info={invoices.find((ele) => ele.id === selectedViewInvoiceId)}
          items={
            invoices.find((ele) => ele.id === selectedViewInvoiceId)?.items ||
            []
          }
          currency={
            invoices.find((ele) => ele.id === selectedViewInvoiceId)
              ?.currency || "$"
          }
          subTotal={
            invoices.find((ele) => ele.id === selectedViewInvoiceId)
              ?.subTotal || "0.00"
          }
          taxAmmount={
            invoices.find((ele) => ele.id === selectedViewInvoiceId)
              ?.taxAmount || "0.00"
          }
          discountAmmount={
            invoices.find((ele) => ele.id === selectedViewInvoiceId)
              ?.discountAmount || "0.00"
          }
          total={
            invoices.find((ele) => ele.id === selectedViewInvoiceId)?.total ||
            "0.00"
          }
          showSavebutton={false}
        />
      )}
    </>
  );
};
export default Bills;
