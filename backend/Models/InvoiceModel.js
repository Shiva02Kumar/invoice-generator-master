const mongoose = require('mongoose')

const db_link = `mongodb+srv://BroInBlack:AEdToPngN0KzVOlK@cluster0.rktru8c.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(db_link)
    .then(function (db) {
        console.log("db connected");
    })
    .catch(function (err) {
        console.log(err);
    })

const itemSchema = mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
})

const invoiceSchema = mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    currency: {
        type: String,
        require: true
    },
    currentDate: {
        type: Date,
        require: true
    },
    invoiceNumber: {
        type: Number,
        require: true
    },
    dateOfIssue: {
        type: Date,
        require: true
    },
    billTo: {
        type: String,
        require: true
    },
    billToEmail: {
        type: String,
        require: true
    },
    billToAddress: {
        type: String,
        require: true
    },
    billFrom: {
        type: String,
        require: true
    },
    billFromEmail: {
        type: String,
        require: true
    },
    billFromAddress: {
        type: String,
        require: true
    },
    notes: {
        type: String,
        require: false
    },
    total: {
        type: String,
        require: true
    },
    subTotal: {
        type: String,
        require: true
    },
    taxRate: {
        type: String,
        require: true
    },
    taxAmount: {
        type: String,
        require: true
    },
    discountRate: {
        type: String,
        require: true
    },
    discountAmount: {
        type: String,
        require: true
    },
    items: [itemSchema],
})

const invoiceModel = mongoose.model('invoiceModel', invoiceSchema);

module.exports = invoiceModel;