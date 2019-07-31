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