"use strict";

app.route.get("/sugram/balance", async function (req) {
    console.log("[interface sugram] /sugram/balance request:", req.query);
    const address = String(req.query.address || "").trim();
    if (address === "") {
        throw new Error("Invalid address:" + address);
    }
    const resp = app.balances.get(address, "ETM");
    console.log("[interface sugram] /sugram/balance response:", resp.toString());
    return { balance: resp.toString() };
});

app.route.get("/sugram/withdrawalTo", async function (req) {
    console.log("[interface sugram] /sugram/withdrawalTo request:", req.query);
    const tid = String(req.query.id || "").trim();
    if (tid === "") {
        throw new Error("Invalid transactionId:" + tid);
    }

    const trInfo = await app.model.Transaction.findOne({
        condition: {
            id: tid
        }
    });
    if (trInfo == null) {
        throw new Error("Transaction not Found");
    }
    const extraData = await app.model.WithdrawalTo.findOne({
        condition: {
            tid: trInfo.id
        }
    });
    if (extraData == null) {
        throw new Error("Transaction do not with withdrawal");
    }
    trInfo.outId = extraData.outId;
    return { transaction: trInfo };
});

app.route.get("/sugram/withdrawalTos", async function (req) {
    console.log("[interface sugram] /sugram/withdrawalTos request:", req.query);
    const senderId = String(req.query.senderId || "").trim();
    if (senderId === "") {
        throw new Error("Invalid address:" + senderId);
    }

    const withdrawalTrs = await app.model.WithdrawalTo.findAll({
        condition: {
            senderId: senderId
        }
    });
    return { transactions: withdrawalTrs ? withdrawalTrs : [] };
});