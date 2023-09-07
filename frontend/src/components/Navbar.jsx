import React, {useEffect} from "react";
import { useNavigate , useLocation} from "react-router-dom";
import { Box, Typography, Tooltip } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link } from "react-router-dom";
import {updateInvoiceStateFromStorage} from "../store/slices/InvoiceSliceReducer";
import {useDispatch} from "react-redux";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.indexOf('invoice') === -1) {
            navigate("/invoice");
        }
    }, [navigate]);


  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "25px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: "15px",
          backgroundColor: "#fff",
        }}
      >
        <Box>
          <Link style={{ textDecoration: "none" }} to="/">
            <Typography variant="h5">All Invoices</Typography>
          </Link>
        </Box>
        <Box>
          <Link style={{ textDecoration: "none" }} to="/invoice/create">
            <Tooltip title="create">
              <ReceiptIcon />
            </Tooltip>
          </Link>
        </Box>
      </Box>
    </>
  );
};
export default Navbar;
