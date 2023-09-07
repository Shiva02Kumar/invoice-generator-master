import React, {useEffect, useState} from "react";
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
import {Link, useNavigate} from "react-router-dom";
const Bills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { invoices } = useSelector((state) => state.InvoiceSlice);

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
          {invoices.map((ele) => {
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
