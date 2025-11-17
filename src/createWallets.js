const { ethers } = require('ethers');
const fs = require('fs');

async function createWallets(count = 5) {
    const wallets = [];

    console.log(`Creating ${count} wallets...\n`);

    for (let i = 0; i < count; i++) {
        const wallet = ethers.Wallet.createRandom();
        wallets.push({
            index: i + 1,
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase
        });
        // {
        //     index: 1,
        //         address: "0x...",
        //             privateKey: "0x...",
        //                 mnemonic: "word1 word2 word3..."
        // }

        console.log(`Wallet ${i + 1}:`);
        console.log(`Address: ${wallet.address}`);
        console.log(`Private Key: ${wallet.privateKey}`);
        console.log('---');
    }

    // Save wallets to file
    fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
    console.log('\n✅ Wallets saved to wallets.json');
    console.log('\n📝 Next steps:');
    console.log('1. Get testnet faucet for each address from:');
    console.log('   - https://sepoliafaucet.com/');
    console.log('   - https://www.infura.io/faucet/sepolia');
    console.log('2. Wait for transactions to confirm');
    console.log('3. Run: npm run consolidate');

    return wallets;
}

// Run if called directly
if (require.main === module) {
    const count = process.argv[2] || 5;
    createWallets(parseInt(count));
}

module.exports = { createWallets };