import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import {initialInvoice} from "../store/slices/constant"
import {
  checkCurrency,
  editFieldReducer,
  rowAddReducer,
  rowDeleteReducer,
  itemizedItemEditReducer,
  calculateTotalReducer,
  modalReducer,
} from "../store/slices/InvoiceSliceReducer";

const InvoiceForm = (props) => {
  const dispatch = useDispatch();
  const { id:invoiceFormId } = useParams();
  const { invoiceCount, invoices } = useSelector(
    (state) => state.InvoiceSlice
  );
  // const invoiceGlobalState = EditThisInvoice
  let invoiceGlobalState= initialInvoice;

  if(invoiceFormId){
    invoiceGlobalState = invoices.find((ele)=> ele.id.toString() === invoiceFormId) || initialInvoice;
  }else {
    invoiceGlobalState = invoices[invoiceCount] ? invoices[invoiceCount] : initialInvoice;
  }

  // ? invoiceCount.find((ele) => ele.id === EditThisInvoice)
  useEffect(() => {
    invoiceGlobalState.items?.length && invoiceGlobalState.taxRate && invoiceGlobalState.discountRate && handleCalculateTotal();
  }, [
    invoiceGlobalState.items,
    invoiceGlobalState.taxRate,
    invoiceGlobalState.discountRate,
  ]);

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };

    dispatch(rowAddReducer({ items: [...invoiceGlobalState.items, newItem],invoiceFormId }));
  };

  const handleCalculateTotal = () => {
    const { items, taxRate, discountRate } = invoiceGlobalState;
    let subTotal = 0;

    items.forEach((item) => {
      subTotal += parseFloat(item.price) * parseInt(item.quantity);
    });
    const taxAmount = (subTotal * (taxRate / 100)).toFixed(2);
    const discountAmount = (subTotal * (discountRate / 100)).toFixed(2);
    const total = (subTotal - discountAmount + parseFloat(taxAmount)).toFixed(
      2
    );

    dispatch(
      calculateTotalReducer({
        subTotal: subTotal.toFixed(2),
        taxAmount,
        discountAmount,
        total,
        invoiceFormId,
      })
    );
  };

  const onItemizedItemEdit = (event, id) => {
    const { name, value } = event.target;
    const updatedItems = invoiceGlobalState.items.map((item) => {
      if (item.id === id) {
        return { ...item, [name]: value };
      }
      return item;
    });

    // useEffect(() => {
    //   EditThisInvoice && handleCalculateTotal();
    // }, [EditThisInvoice]);

    handleCalculateTotal();

    dispatch(
      itemizedItemEditReducer({
        updatedItems,
        invoiceFormId,
      })
    );
  };

  const handleRowDel = (item) => {
    const updatedItems = invoiceGlobalState.items.filter(
      (i) => i.id !== item.id
    );
    dispatch(rowDeleteReducer({ updatedItems,invoiceFormId }));
  };

  const editField = (event) => {
    const { name, value } = event.target;
    handleCalculateTotal();
    dispatch(editFieldReducer({ name, value,invoiceFormId }));
  };

  const onCurrencyChange = (event) => {
    const { value } = event.target;

    dispatch(checkCurrency({ key: "currency", value,invoiceFormId }));
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    dispatch(modalReducer({ isOpen: true,invoiceFormId }));
  };

  const closeModal = () => {
    dispatch(modalReducer({ isOpen: false,invoiceFormId }));
  };

  return (
    <>
      <Form onSubmit={openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="current-date">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control
                      type="date"
                      value={invoiceGlobalState.dateOfIssue}
                      name={"dateOfIssue"}
                      onChange={(event) => editField(event)}
                      style={{
                        maxWidth: "150px",
                      }}
                      required={true}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">
                    Invoice&nbsp;Number:&nbsp;
                  </span>
                  <Form.Control
                    type="number"
                    value={invoiceGlobalState.invoiceNumber}
                    name={"invoiceNumber"}
                    onChange={(event) => editField(event)}
                    min="1"
                    style={{
                      maxWidth: "70px",
                    }}
                    required={true}
                  />
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder={"Who is this invoice to?"}
                    rows={3}
                    value={invoiceGlobalState.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={(event) => editField(event)}
                    autoComplete="name"
                    required={true}
                  />
                  <Form.Control
                    placeholder={"Email address"}
                    value={invoiceGlobalState.billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    onChange={(event) => editField(event)}
                    autoComplete="email"
                    required={true}
                  />
                  <Form.Control
                    placeholder={"Billing address"}
                    value={invoiceGlobalState.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => editField(event)}
                    required={true}
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control
                    placeholder={"Who is this invoice from?"}
                    rows={3}
                    value={invoiceGlobalState.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={(event) => editField(event)}
                    autoComplete="name"
                    required={true}
                  />
                  <Form.Control
                    placeholder={"Email address"}
                    value={invoiceGlobalState.billFromEmail}
                    type="email"
                    name="billFromEmail"
                    className="my-2"
                    onChange={(event) => editField(event)}
                    autoComplete="email"
                    required={true}
                  />
                  <Form.Control
                    placeholder={"Billing address"}
                    value={invoiceGlobalState.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => editField(event)}
                    required={true}
                  />
                </Col>
              </Row>
              <InvoiceItem
                onItemizedItemEdit={onItemizedItemEdit}
                onRowAdd={handleAddEvent}
                onRowDel={handleRowDel}
                currency={invoiceGlobalState.currency}
                items={invoiceGlobalState.items}
              />
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>
                      {invoiceGlobalState.currency}
                      {invoiceGlobalState.subTotal}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small ">
                        ({invoiceGlobalState.discountRate || 0}%)
                      </span>
                      {invoiceGlobalState.currency}
                      {invoiceGlobalState.discountAmmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>
                      <span className="small ">
                        ({invoiceGlobalState.taxRate || 0}%)
                      </span>
                      {invoiceGlobalState.currency}
                      {invoiceGlobalState.taxAmmount || 0}
                    </span>
                  </div>
                  <hr />
                  <div
                    className="d-flex flex-row align-items-start justify-content-between"
                    style={{
                      fontSize: "1.125rem",
                    }}
                  >
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">
                      {invoiceGlobalState.currency}
                      {invoiceGlobalState.total || 0}
                    </span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
                placeholder="Thanks for your business!"
                name="notes"
                value={invoiceGlobalState.notes}
                onChange={(event) => editField(event)}
                as="textarea"
                className="my-2"
                rows={1}
              />
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">
                {invoiceFormId ? `Update Invoice` : `Create Invoice`}
              </Button>
              <hr className="my-4" />
              <InvoiceModal
                showModal={invoiceGlobalState.isOpen}
                closeModal={closeModal}
                invoiceFormId={invoiceFormId}
                info={invoiceGlobalState}
                items={invoiceGlobalState.items}
                currency={invoiceGlobalState.currency}
                subTotal={invoiceGlobalState.subTotal}
                taxAmmount={invoiceGlobalState.taxAmmount}
                discountAmmount={invoiceGlobalState.discountAmmount}
                showSavebutton={true}
                total={invoiceGlobalState.total}
              />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  onChange={(event) => onCurrencyChange(event)}
                  className="btn btn-light my-1"
                  aria-label="Change Currency"
                >
                  <option value="$">USD (United States Dollar)</option>
                  <option value="₹">INR (Indian National Rupee)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Signapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    type="number"
                    value={invoiceGlobalState.taxRate}
                    onChange={(event) => editField(event)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    type="number"
                    value={invoiceGlobalState.discountRate}
                    onChange={(event) => editField(event)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default InvoiceForm;
