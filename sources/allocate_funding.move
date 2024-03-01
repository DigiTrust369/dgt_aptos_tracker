module dgt_apt_contract_v4::allocate_funding_v4 {
    use aptos_framework::coin;
    use std::string::String;
    use std::signer;
    use std::timestamp;

    struct WDGT {}

    struct Order has key, store, drop, copy{
        symbol: String, 
        amount: u64, 
        note: String, 
        buyer: address, 
        from: String, 
        tx_hash: String, 
        created_at: u64
    }

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<WDGT>(
            sender,
            b"ETF DGT Token",
            b"WDGT",
            6,
            false,
        );
    }

    public entry fun register(account: &signer) {
        aptos_framework::managed_coin::register<WDGT>(account)
    }

    public entry fun mint(account: &signer, dst_addr: address, amount: u64) {
        aptos_framework::managed_coin::mint<WDGT>(account, dst_addr, amount);
    }

    public entry fun burn(account: &signer, amount: u64) {
        aptos_framework::managed_coin::burn<WDGT>(account, amount);
    }

    public entry fun transfer(from: &signer, to: address, amount: u64,) {
        coin::transfer<WDGT>(from, to, amount);
    }

    public entry fun buy_asset(account: &signer, symbol: String, note: String, from: String, tx_hash: String){
        let order = Order{
            symbol: symbol, 
            amount: 2411, 
            note: note, 
            buyer: signer::address_of(account), 
            from: from, 
            tx_hash: tx_hash, 
            created_at: timestamp::now_seconds(),
        };

        // move_to(account, order);
    }
}