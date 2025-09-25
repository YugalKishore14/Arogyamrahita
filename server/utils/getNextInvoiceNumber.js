const Counter = require("../models/invoiceCounter.model");

const getNextInvoiceNumber = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "invoice" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

module.exports = { getNextInvoiceNumber };
