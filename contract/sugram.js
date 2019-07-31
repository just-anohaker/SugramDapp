"use strict";

const base58check = require("../helpers/base58check");
const bignum = require("bignumber");

function isaddress(address) {
    if (typeof address !== "string") return false;
    if (!base58check.decodeUnsafe(address.slice(1))) return false;
    if (["A"].indexOf(address[0]) !== -1) return false;
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

        if (!app.validate("amount", amount)
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
    }
}