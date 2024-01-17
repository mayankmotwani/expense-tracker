const express = require("express");
const moment = require("moment");

const Transaction = require("../models/Transaction");

const router = express.Router();

router.post("/add-transaction", async function (req, res) {
    try {
        const newtransaction = new Transaction(req.body);
        await newtransaction.save();
        res.send("Transaction Added Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/edit-transaction", async function (req, res) {
    try {
        await Transaction.findOneAndUpdate({
            _id: req.body.transactionId
        }, req.body.payload)
        res.send("Transaction Updated Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/delete-transaction", async function (req, res) {
    try {
        await Transaction.findOneAndDelete({
            _id: req.body.transactionId
        })
        res.send("Transaction Deleted Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/get-all-transactions", async function (req, res) {
    const { timePeriod, selectedRange, type } = req.body;
    try {
        const transactions = await Transaction.find({
            userid: req.body.userid,
            date: timePeriod !== "custom"
              ? { $gt: moment().subtract(Number(timePeriod), "d").toDate() }
              : { $gte: selectedRange[0], $lt: selectedRange[1] },
            ...(type !== 'all' && { type })
        });
        
        res.send(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;
