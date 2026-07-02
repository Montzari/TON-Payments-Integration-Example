const express = require('express');
const path = require('path');
const { Address } = require('@ton/core');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 1. CONFIGURATION ---

const DESTINATION_ADDRESS = "PUT YOUR TON ADDRESS HERE"; 
const AMOUNT_NANOTONS = "100000"; // 0.0001 TON
const POINTS_PER_PAYMENT = 10;

const users = {}; 
const processedTxHashes = new Set(); 

// --- 3. ENDPOINTS ---

app.get('/api/points/:address', (req, res) => {
    const address = req.params.address;
    const points = users[address] ? users[address].points : 0;
    res.json({ points });
});

app.post('/api/verify', async (req, res) => {
    const { senderAddress } = req.body;

    if (!senderAddress) {
        return res.status(400).json({ success: false, message: "Missing sender address" });
    }

    try {
        let response;
        try {
            
            response = await fetch(`https://toncenter.com/api/v3/transactions?account=${DESTINATION_ADDRESS}&limit=20`);
        } catch (networkErr) {
            console.error("Mainnet API Timeout:", networkErr.message);
            return res.status(502).json({ success: false, message: "API Timeout" });
        }

        if (!response.ok) return res.status(502).json({ success: false });
        
        const data = await response.json();

        if (data && data.transactions) {
            for (const tx of data.transactions) {
                // Skip if no incoming message
                if (!tx.in_msg || !tx.in_msg.source) continue; 
                
                try {
                    // Use @ton/core to safely parse and compare addresses
                    const apiSourceRaw = Address.parse(tx.in_msg.source).toRawString();
                    const clientSenderRaw = Address.parse(senderAddress).toRawString();

                    if (apiSourceRaw === clientSenderRaw && String(tx.in_msg.value) === AMOUNT_NANOTONS) {
                        
                        // Prevent double-counting the same transaction
                        if (!processedTxHashes.has(tx.hash)) {
                            processedTxHashes.add(tx.hash);
                            
                            if (!users[senderAddress]) {
                                users[senderAddress] = { points: 0 };
                            }
                            users[senderAddress].points += POINTS_PER_PAYMENT;

                            console.log(`✅ Verified 0.0001 TON from ${senderAddress}. Awarded 10 points.`);
                            
                            return res.json({ 
                                success: true, 
                                points: users[senderAddress].points 
                            });
                        }
                    }
                } catch (e) {
                    // Ignore transactions with weird address formats
                    continue; 
                }
            }
        }
        return res.status(404).json({ success: false, message: "Transaction not found on the blockchain yet." });
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));