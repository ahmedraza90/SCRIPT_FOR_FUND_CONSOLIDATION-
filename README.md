COMPLETE PROCESS:
│
├─ PHASE 1: Wallet Creation
│   └─ Run: npm run create-wallets
│       └─ Output: wallets.json with 5 wallet addresses
│
├─ PHASE 2: Funding (Manual)
│   └─ Visit faucet websites
│       └─ Request test ETH for each address
│           └─ Wait for confirmations (~1-5 minutes)
│
└─ PHASE 3: Consolidation
    └─ Run: npm run consolidate
        └─ Output: All funds → Main wallet address



WALLET CREATION:
START
├─ INPUT: count (number of wallets to create, default = 5)
├─ INITIALIZE: empty array 'wallets'
│
├─ FOR i = 0 to count-1:
│   ├─ GENERATE: Random Ethereum wallet using ethers.Wallet.createRandom()
│   │   ├─ Creates private key (256-bit random number)
│   │   ├─ Derives public key from private key (ECDSA)
│   │   ├─ Derives address from public key (last 20 bytes of Keccak-256 hash)
│   │   └─ Generates BIP-39 mnemonic phrase (12-24 words)
│   │
│   ├─ STORE wallet data in array:
│   │   ├─ index: i + 1
│   │   ├─ address: wallet.address (0x...)
│   │   ├─ privateKey: wallet.privateKey (0x...)
│   │   └─ mnemonic: wallet.mnemonic.phrase
│   │
│   └─ DISPLAY wallet info to console
│
├─ WRITE wallets array to 'wallets.json' file (JSON format)
├─ DISPLAY success message
├─ DISPLAY next steps instructions
└─ RETURN: wallets array
END



SEND FUNDS:
START distributeFunds(amountPerWallet = "0.01")

├─ PHASE 1: LOAD & INITIALIZE
│   │
│   ├─ STEP 1: Load Configuration
│   │   ├─ READ wallets.json file
│   │   ├─ PARSE JSON → array of wallet objects
│   │   └─ STORE in 'wallets' variable
│   │
│   ├─ STEP 2: Connect to Blockchain
│   │   ├─ READ RPC_URL from .env
│   │   └─ CREATE JsonRpcProvider (connects to Sepolia network)
│   │
│   ├─ STEP 3: Load Main Wallet (Source of Funds)
│   │   ├─ READ MAIN_WALLET_PRIVATE_KEY from .env
│   │   ├─ VALIDATE: IF private key is empty → THROW ERROR
│   │   ├─ CREATE Wallet instance from private key
│   │   └─ CONNECT wallet to provider
│   │
│   └─ STEP 4: Check Main Wallet Balance
│       ├─ QUERY blockchain for wallet balance
│       ├─ DISPLAY wallet address
│       └─ DISPLAY current balance in ETH
│
├─ PHASE 2: CALCULATE & VALIDATE
│   │
│   ├─ STEP 5: Parse Amount
│   │   └─ CONVERT amountPerWallet string to Wei (ethers.parseEther)
│   │       Example: "0.01" → 10000000000000000 Wei
│   │
│   ├─ STEP 6: Calculate Total Required
│   │   └─ FORMULA: totalRequired = amountToSend × number of wallets
│   │       Example: 0.01 ETH × 5 wallets = 0.05 ETH
│   │
│   ├─ STEP 7: Display Distribution Plan
│   │   ├─ Amount per wallet
│   │   ├─ Number of wallets
│   │   └─ Total ETH needed
│   │
│   └─ STEP 8: Validate Sufficient Balance
│       ├─ IF mainBalance < totalRequired:
│       │   ├─ DISPLAY error message
│       │   └─ EXIT function
│       └─ ELSE: CONTINUE
│
├─ PHASE 3: EXECUTE DISTRIBUTION (LOOP)
│   │
│   └─ FOR EACH walletData in wallets array:
│       │
│       ├─ STEP 9: Create Transaction Object
│       │   ├─ to: recipient wallet address
│       │   ├─ value: amountToSend (in Wei)
│       │   └─ (gasLimit auto-calculated by ethers.js)
│       │
│       ├─ STEP 10: Sign & Send Transaction
│       │   ├─ Sign transaction with main wallet private key
│       │   ├─ BROADCAST to network via RPC
│       │   └─ RECEIVE transaction hash
│       │
│       ├─ STEP 11: Display Transaction Info
│       │   ├─ Wallet index
│       │   ├─ Recipient address
│       │   ├─ Transaction hash
│       │   └─ Amount sent
│       │
│       ├─ STEP 12: Wait for Confirmation
│       │   ├─ CALL tx.wait()
│       │   ├─ WAIT for transaction to be mined
│       │   ├─ GET receipt with block number
│       │   └─ DISPLAY confirmation
│       │
│       └─ ERROR HANDLING:
│           └─ IF transaction fails:
│               ├─ CATCH error
│               ├─ DISPLAY error message
│               └─ CONTINUE to next wallet
│
├─ PHASE 4: FINALIZATION
│   │
│   ├─ STEP 13: Check Final Balance
│   │   └─ QUERY main wallet balance again
│   │
│   ├─ STEP 14: Display Summary
│   │   ├─ "Distribution complete"
│   │   ├─ Remaining balance
│   │   └─ Next step instructions
│   │
│   └─ ERROR HANDLING:
│       └─ CATCH any errors → DISPLAY error message
│
└─ END


CONSOLIDATING FUNDS:
START
├─ LOAD configuration:
│   ├─ READ wallets.json file → parse JSON
│   ├─ READ .env file → get MAIN_WALLET_ADDRESS
│   └─ READ .env file → get RPC_URL
│
├─ VALIDATE:
│   └─ IF MAIN_WALLET_ADDRESS is empty → THROW ERROR
│
├─ CONNECT to Ethereum network:
│   └─ CREATE JsonRpcProvider with RPC_URL
│
├─ FOR EACH wallet in wallets array:
│   │
│   ├─ STEP 1: Load Wallet
│   │   ├─ CREATE wallet instance from privateKey
│   │   └─ CONNECT wallet to provider
│   │
│   ├─ STEP 2: Check Balance
│   │   └─ GET current balance of wallet address
│   │
│   ├─ STEP 3: Calculate Transfer Amount
│   │   ├─ IF balance > 0:
│   │   │   ├─ GET current gas price (feeData)
│   │   │   ├─ CALCULATE gas cost = gasLimit (21000) × gasPrice
│   │   │   ├─ CALCULATE amountToSend = balance - gasCost
│   │   │   │
│   │   │   ├─ IF amountToSend > 0:
│   │   │   │   ├─ STEP 4: Create Transaction
│   │   │   │   │   ├─ to: mainAddress
│   │   │   │   │   ├─ value: amountToSend
│   │   │   │   │   └─ gasLimit: 21000
│   │   │   │   │
│   │   │   │   ├─ STEP 5: Send Transaction
│   │   │   │   │   └─ BROADCAST transaction to network
│   │   │   │   │
│   │   │   │   ├─ STEP 6: Wait for Confirmation
│   │   │   │   │   └─ WAIT for transaction to be mined
│   │   │   │   │
│   │   │   │   └─ DISPLAY success message
│   │   │   │
│   │   │   └─ ELSE: DISPLAY "Insufficient balance for gas"
│   │   │
│   │   └─ ELSE: DISPLAY "No balance to transfer"
│   │
│   └─ CONTINUE to next wallet
│
├─ DISPLAY "Consolidation complete"
└─ CATCH any errors → DISPLAY error message
END