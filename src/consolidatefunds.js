require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

async function consolidateFunds() {
    try {
        // Load wallets
        const wallets = JSON.parse(fs.readFileSync('wallets.json', 'utf-8'));
        const mainAddress = process.env.MAIN_WALLET_ADDRESS;

        if (!mainAddress) {
            throw new Error('MAIN_WALLET_ADDRESS not set in .env file');
        }

        // Connect to network
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

        console.log(`Consolidating funds to: ${mainAddress}\n`);

        for (const walletData of wallets) {
            const wallet = new ethers.Wallet(walletData.privateKey, provider);
            const balance = await provider.getBalance(wallet.address);

            console.log(`Wallet ${walletData.index} (${wallet.address}):`);
            console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

            if (balance > 0) {
                // Get gas price
                const feeData = await provider.getFeeData();
                const gasLimit = 21000n;
                const gasCost = gasLimit * feeData.gasPrice;

                const amountToSend = balance - gasCost;

                if (amountToSend > 0) {
                    const tx = await wallet.sendTransaction({
                        to: mainAddress,
                        value: amountToSend,
                        gasLimit: gasLimit
                    });

                    console.log(`✅ Transaction sent: ${tx.hash}`);
                    await tx.wait();
                    console.log(`✅ Transferred ${ethers.formatEther(amountToSend)} ETH\n`);
                } else {
                    console.log('⚠️ Insufficient balance for gas fees\n');
                }
            } else {
                console.log('⚠️ No balance to transfer\n');
            }
        }

        console.log('✅ Consolidation complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

if (require.main === module) {
    consolidateFunds();
}

module.exports = { consolidateFunds };