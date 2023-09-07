const express = require('express');
const app = express();
const invoiceRouter = require('./Routers/InvoiceRouter')

app.use(express.json());
app.use("/invoice", invoiceRouter)

app.listen(5000, () =>console.log(`Server is running on port: 5000`));