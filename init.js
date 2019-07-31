"use strict";

module.exports = async function () {
    console.log('enter dapp[SugramDapp] init');

    // disable deposit, withdrawal, transfer Fee
    app.registerFee(1, 0);
    app.registerFee(2, 0);
    app.registerFee(3, 0);

    app.registerFee(1000, 0);
    app.registerContract(1000, "sugram.pay");

    console.log("dapp[SugramDapp] inited");
    // 
    app.events.on('newBlock', (block) => {
        console.log('new block received', block.height)
    });
}