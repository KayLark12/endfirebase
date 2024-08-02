import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Atau gunakan `import axios from 'axios';` jika Anda ingin menggunakan axios

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handler untuk permintaan GET pada root endpoint
app.get('/', (req, res) => {
    res.send('Server is running.');
});

// Midtrans Notification Handler
app.post('/', async (req, res) => {
    try {
        const notification = req.body;
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const transactionTime = notification.transaction_time;
        const settlementTime = notification.settlement_time;

        // Log informasi yang diterima
        console.log(`Received notification for Order ID: ${orderId}`);
        console.log(`Transaction Status: ${transactionStatus}`);
        console.log(`Settlement Time: ${settlementTime}`);

        // Kirim data ke Firebase
        const firebaseUrl = `https://skripsi-tiket-ece21-default-rtdb.asia-southeast1.firebasedatabase.app/pesan/${orderId}.json`;

        const dataToSend = {
            orderId,
            transactionStatus,
            transactionTime,
            settlementTime
        };

        // Mengirim data ke Firebase menggunakan node-fetch
        const response = await fetch(firebaseUrl, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            console.log('Data successfully sent to Firebase');
            res.status(200).send('OK');
        } else {
            console.error('Failed to send data to Firebase');
            res.status(500).send('Failed to process notification');
        }
    } catch (error) {
        console.error('Error processing notification:', error);
        res.status(500).send('Failed to process notification');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
