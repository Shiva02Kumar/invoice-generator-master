const express = require('express')
const invoiceRouter = express.Router();
const { createInvoice } = require('../Controller/InvoiceController')

invoiceRouter
    .route('/create')
    .post(createInvoice)

module.exports = invoiceRouter