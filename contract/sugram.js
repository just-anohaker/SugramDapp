"use strict";

const base58check = require("../helpers/base58check");
const ETMJS = require("etm-js");
const bignum = require("bignumber");

function isaddress(address) {
    if (typeof address !== "string") return false;
    if (!base58check.decodeUnsafe(address.slice(1))) return false;
    if (["A"].indexOf(address[0]) === -1) return false;
    return true;
}

const SUPPORTED_TYPES = [1];

module.exports = {
    pay: async function (recipientId, amount, type, desc = "") {
        if (!isaddress(recipientId)) {
            return "Invalid recipientId";
        }

        if (!SUPPORTED_TYPES.includes(type)) {
            return "Invalid type " + type + ", supported types " + SUPPORTED_TYPES;
        }

        if (app.validate("amount", amount)
            || app.balances.get(this.trs.senderId, "ETM").lt(amount)) {
            return "Insufficient balance";
        }

        app.balances.transfer("ETM", amount, this.trs.senderId, recipientId);
        app.sdb.create("pay", {
            tid: this.trs.id,
            senderId: this.trs.senderId,
            recipientId: recipientId,
            amount: bignum(amount).toString(),
            type,
            desc: desc || ""
        });
    },

    withdrawalTo: async function (recipientId, amount) {
        if (!isaddress(recipientId)) {
            return "Invalid recipientId";
        }

        if (app.validate("amount", amount) || app.balances.get(this.trs.senderId, "ETM").lt(amount)) {
            return "Insufficient balance";
        }

        // app.balances.transfer("ETM", amount, this.trs.senderId);
        app.balances.decrease(this.trs.senderId, "ETM", amount);
        const withdrawalSecret = app.config.secrets[0];
        const feeAmount = "10000000";
        const transferAmount = bignum(amount).sub(feeAmount).toString();
        const outTr = ETMJS.transfer.createOutTransfer(recipientId, app.meta.transactionId, this.trs.id, "ETM", transferAmount, withdrawalSecret);
        outTr.signatures = [];
        for (let i = 0; i < app.config.secrets.length; i++) {
            const secret = app.config.secrets[i];
            if (secret !== withdrawalSecret) {
                outTr.signatures.push(ETMJS.transfer.signOutTransfer(outTr, secret));
            }
            if (outTr.signatures.length >= app.meta.unlockDelegates) {
                break;
            }
        }

        try {
            await global.PIFY(app.api.dapps.submitOutTransfer)(outTr);
            app.sdb.create("withdrawalTo", {
                tid: this.trs.id,
                senderId: this.trs.senderId,
                recipientId: recipientId,
                amount: transferAmount,
                fee: feeAmount,
                currency: "ETM",
                outId: outTr.id
            });
        } catch (error) {
            return error.toString();
        }
    }
}