require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

async function distributeFunds(amountPerWallet = "0.01") {
    try {
        // Load generated wallets
        const wallets = JSON.parse(fs.readFileSync('wallets.json', 'utf-8'));

        // Connect to network
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

        // Load your main wallet that has funds
        const mainWalletPrivateKey = process.env.MAIN_WALLET_PRIVATE_KEY;
        if (!mainWalletPrivateKey) {
            throw new Error('MAIN_WALLET_PRIVATE_KEY not set in .env file');
        }

        const mainWallet = new ethers.Wallet(mainWalletPrivateKey, provider);
        const mainBalance = await provider.getBalance(mainWallet.address);

        console.log(`\n💼 Main Wallet: ${mainWallet.address}`);
        console.log(`💰 Balance: ${ethers.formatEther(mainBalance)} ETH\n`);

        const amountToSend = ethers.parseEther(amountPerWallet);
        const totalRequired = amountToSend * BigInt(wallets.length);

        console.log(`📊 Distribution Plan:`);
        console.log(`   - Amount per wallet: ${amountPerWallet} ETH`);
        console.log(`   - Number of wallets: ${wallets.length}`);
        console.log(`   - Total needed: ${ethers.formatEther(totalRequired)} ETH\n`);

        if (mainBalance < totalRequired) {
            console.error('❌ Insufficient balance in main wallet!');
            return;
        }

        console.log('🚀 Starting distribution...\n');

        for (const walletData of wallets) {
            try {
                // Send transaction
                const tx = await mainWallet.sendTransaction({
                    to: walletData.address,
                    value: amountToSend
                });

                console.log(`📤 Wallet ${walletData.index}: ${walletData.address}`);
                console.log(`   TX Hash: ${tx.hash}`);
                console.log(`   Amount: ${amountPerWallet} ETH`);

                // Wait for confirmation
                const receipt = await tx.wait();
                console.log(`   ✅ Confirmed in block ${receipt.blockNumber}\n`);

            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}\n`);
            }
        }

        // Check final balance
        const finalBalance = await provider.getBalance(mainWallet.address);
        console.log(`\n✅ Distribution complete!`);
        console.log(`💰 Remaining balance: ${ethers.formatEther(finalBalance)} ETH`);
        console.log(`\n📝 Next step: Run 'npm run consolidate' to collect funds back\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    // Get amount from command line or use default
    const amount = process.argv[2] || "0.01";
    distributeFunds(amount);
}