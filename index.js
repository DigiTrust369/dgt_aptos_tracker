// const { AptosConfig, Network, Account } = require("aptos");
const { Aptos, AptosConfig, Network, Ed25519PrivateKey, Secp256k1PrivateKey } = require("@aptos-labs/ts-sdk");
const redis = require("redis")

const options = {
    url: 'redis://localhost:6379'
};
  
const client = redis.createClient(options);

client.on('error', (e) => {
    console.log("Error connection: ", e.message)
    // logger.error(`Redis connection error: ${e.message}`);
});

client.on('connect', () => {
    console.log('Redis connected');
});


const config = new AptosConfig({ network: Network.DEVNET }); // default network is devnet
const aptos = new Aptos(config);
const privateKey = new Secp256k1PrivateKey("0xf29d8be243551671c7949f59538980de229cc62061a95ce1505a790f955068e5");

async function sharing_portfolio(){
    const dgt_account = await aptos.deriveAccountFromPrivateKey({privateKey});

    // redis.client
    await client.connect()
    const resp = await client.set("dgt_signal_v1", "test_aptos_v1")
    console.log("Redis resp: ", resp)

    const transaction = await aptos.transaction.build.simple({
        sender: "0xe8ec9945a78a48452def46207e65a0a4ed6acd400306b977020924ae3652ab85",
        data: {
            function: "0xe8ec9945a78a48452def46207e65a0a4ed6acd400306b977020924ae3652ab85::signal_v2::share_portfolio",
            functionArguments: ["DGT_v3", "Aptos", "2.4", "6%", "3%"],
        },
    });

    // using signAndSubmit combined
    const committedTransaction = await aptos.signAndSubmitTransaction({ signer: dgt_account, transaction });
    console.log("Tx resp: ", committedTransaction)
}

async function buy_asset() {    
    const dgt_account = await aptos.deriveAccountFromPrivateKey({privateKey});

    const transaction = await aptos.transaction.build.simple({
        sender: "0xe8ec9945a78a48452def46207e65a0a4ed6acd400306b977020924ae3652ab85",
        data: {
            function: "0xe8ec9945a78a48452def46207e65a0a4ed6acd400306b977020924ae3652ab85::allocate_funding_v2::buy_asset",
            functionArguments: ["PQD_v25", "Dgt_v25 funding", "Aptos", "0x123cds24111306"],
        },
    });

    // using signAndSubmit combined
    const committedTransaction = await aptos.signAndSubmitTransaction({ signer: dgt_account, transaction });
    console.log("Tx resp: ", committedTransaction)
}

// buy_asset()
sharing_portfolio()