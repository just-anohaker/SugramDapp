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

app.route.get("/sugram/withdrawals", async function (req) {
    console.log("[interface sugram] /sugram/withdrawalTo request:", req.query);
    const id = String(req.query.id || "").trim();
    const senderId = String(req.query.senderId || "").trim();
    const recipientId = String(req.query.recipientId || "").trim();
    if (id === "" && senderId === "" && recipientId === "") {
        throw new Error("Invalid arguments, must has one of ['id', 'senderId', 'recipientId']");
    }

    if (id !== "") {
        const outTransferTr = await app.model.WithdrawalTo.findOne({
            condition: {
                tid: id
            }
        });
        if (outTransferTr == null) {
            throw new Error("Transaction do not with withdrawal");
        }
        return { transaction: [outTransferTr] };
    }

    if (senderId !== "") {
        const withdrawalTrs = await app.model.WithdrawalTo.findAll({
            condition: {
                senderId: senderId
            }
        });
        return { transactions: withdrawalTrs ? withdrawalTrs : [] };
    }

    if (recipientId !== "") {
        const withdrawalTrs = await app.model.WithdrawalTo.findAll({
            condition: {
                recipientId: recipientId
            }
        });
        return { transactions: withdrawalTrs ? withdrawalTrs : [] };
    }
});