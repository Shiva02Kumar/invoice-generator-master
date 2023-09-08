const express = require('express')
const invoiceRouter = express.Router();
const { allInvoices, createInvoice, updateInvoice } = require('../Controller/InvoiceController')

invoiceRouter
    .route('/')
    .get(allInvoices)

invoiceRouter
    .route('/create')
    .post(createInvoice)

invoiceRouter
    .route('/edit/:id')
    .patch(updateInvoice)

module.exports = invoiceRouter