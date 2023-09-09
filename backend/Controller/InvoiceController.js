const invoiceModel = require('../Models/InvoiceModel')

async function allInvoices(req, res) {
    try {
        let invoices = await invoiceModel.find()
        console.log(invoices);
        if (invoices) {
            res.json({
                message: "found invoices",
                dataFromDB: invoices
            })
        }
        else {
            res.json({
                message: "no invoices found",
                data: invoices
            })
        }
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}


async function createInvoice(req, res) {
    try {
        let dataobj = req.body;
        let invoice = await invoiceModel.create(dataobj)
        if (invoice) {
            res.json({
                message: "invoice added",
                data: invoice
            })
        }
        else {
            res.json({
                message: "invoice not added",
                data: invoice
            })
        }
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

async function updateInvoice(req, res) {
    try {
        let id = req.params.id;
        let invoice = await invoiceModel.findById(id)
        let dataToUpdate = req.body;
        if (invoice) {
            let keys = [];
            for (let key in dataToUpdate) {
                keys.push(key);
            }
            for (let i = 0; i < keys.length; i++) {
                invoice[keys[i]] = dataToUpdate[keys[i]];
            }
            const updatedInvoice = await user.save();
            res.json({
                message: "data updated succesfully",
                users: updatedInvoice
            });
        }
        else {
            res.json({
                message: "user not found"
            });
        }
        
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

module.exports = { allInvoices, createInvoice, updateInvoice }