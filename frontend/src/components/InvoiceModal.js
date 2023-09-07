import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload, BiSave } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { saveInvoiceReducer, editInvoiceReducer,modalReducer } from '../store/slices/InvoiceSliceReducer';
import { Link } from "react-router-dom";



const GenerateInvoice = (props) => {

  const dispatch = useDispatch();
  const { invoiceCount, invoices } = useSelector((state) => state.InvoiceSlice);
  // const invoiceGlobalState = invoices[invoiceCount];

  const handleGenerateInvoice = () => {
    html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 792]
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice-001.pdf');
    });
  };

  const saveInvoice = (e) => {
    toast.success("INVOICE SAVED SUCCESSFULLY", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    dispatch(modalReducer({ isOpen: false,invoiceFormId : props.invoiceFormId }));
    dispatch(saveInvoiceReducer());
    dispatch(editInvoiceReducer(null));
    props.closeModal();
  }

  return (
    <div>
      <Modal show={props.showModal} onHide={props.closeModal} size="lg" centered>
        <div id="invoiceCapture">
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h4 className="fw-bold my-2">{props.info.billFrom || 'John Uberbacher'}</h4>
              <h6 className="fw-bold text-secondary mb-1">
                Invoice #: {props.info.invoiceNumber || ''}
              </h6>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
              <h5 className="fw-bold text-secondary">
                {props.currency} {props.total}
              </h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{props.info.billTo || ''}</div>
                <div>{props.info.billToAddress || ''}</div>
                <div>{props.info.billToEmail || ''}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{props.info.billFrom || ''}</div>
                <div>{props.info.billFromAddress || ''}</div>
                <div>{props.info.billFromEmail || ''}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Date Of Issue:</div>
                <div>{props.info.dateOfIssue || ''}</div>
              </Col>
            </Row>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {props.items?.map((item, i) => {
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: '70px' }}>
                        {item.quantity}
                      </td>
                      <td>
                        {item.name} - {item.description}
                      </td>
                      <td className="text-end" style={{ width: '100px' }}>{props.currency} {item.price}</td>
                      <td className="text-end" style={{ width: '100px' }}>{props.currency} {item.price * item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Table>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: '100px' }}>SUBTOTAL</td>
                  <td className="text-end" style={{ width: '100px' }}>{props.currency} {props.subTotal}</td>
                </tr>
                {props.taxAmmount !== 0.00 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>TAX</td>
                    <td className="text-end" style={{ width: '100px' }}>{props.currency} {props.taxAmmount}</td>
                  </tr>
                )}
                {props.discountAmmount !== 0.00 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>DISCOUNT</td>
                    <td className="text-end" style={{ width: '100px' }}>{props.currency} {props.discountAmmount}</td>
                  </tr>
                )}
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: '100px' }}>TOTAL</td>
                  <td className="text-end" style={{ width: '100px' }}>{props.currency} {props.total}</td>
                </tr>
              </tbody>
            </Table>
            {props.info.notes && (
              <div className="bg-light py-3 px-4 rounded">
                {props.info.notes}
              </div>
            )}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={6}>
              <Button variant="primary" className="d-block w-100" onClick={handleGenerateInvoice}>
                <BiPaperPlane style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />Send Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={handleGenerateInvoice}>
                <BiCloudDownload style={{ width: '16px', height: '16px', marginTop: '-3px' }} className="me-2" />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
        <div className="pb-4 px-4  ">
          {props.showSavebutton && (<Row>
            <Col md={12}>
              <Link style={{ textDecoration: "none" }} to="/">
                <Button variant="success" className="d-block w-100"
                  onClick={(e) => saveInvoice(e)}
                >
                  <BiSave style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />
                  SAVE INVOICE
                </Button>
              </Link>
            </Col>
          </Row>)}
        </div>
      </Modal>
      <hr className="mt-4 mb-3" />

    </div>
  );
};

const InvoiceModal = (props) => {
  return (
    <GenerateInvoice {...props} />
  );
};

export default InvoiceModal;

