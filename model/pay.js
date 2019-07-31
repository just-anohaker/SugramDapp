"use strict";

module.exports = {
    name: "pays",
    fields: [
        {
            name: "tid",
            type: "String",
            length: 64,
            not_null: !0,
            unique: !0,
            primary_key: !0
        },
        {
            name: "senderId",
            type: "String",
            length: 50,
            not_null: !0
        },
        {
            name: "recipientId",
            type: "String",
            length: 50,
            not_null: !0
        },
        {
            name: "amount",
            type: "String",
            length: 50,
            not_null: !0,
        },
        {
            name: "type",
            type: "Number",
            not_null: !0
        },
        {
            name: "desc",
            type: "String",
            length: 4096
        }
    ]
}