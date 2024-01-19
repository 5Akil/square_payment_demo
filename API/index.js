const express = require("express");
const { Client } = require("square");
const Cors = require("cors")
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;
const app = express();
const bodyParser = require('body-parser')
const crypto = require('crypto')

app.use(Cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const { paymentsApi, webhooks, oAuthApi } = new Client({
    accessToken: "EAAAEHCJV9rm5bIOKlJrviSw_OtJoIBE6tS0VX3aKNCkvDpLZDsPQhck8f4NjYAU",
    environment: 'sandbox'
});

app.post('/api/pay', async (req, res) => {
    const { result } = await paymentsApi.createPayment({
        idempotencyKey: uuidv4().toString(),
        sourceId: req.body.sourceId,
        amountMoney: {
            currency: 'USD',
            amount: 5000,
        }, appFeeMoney: {
            amount: 70,
            currency: 'USD'
        },
    })

    const jsonString = JSON.stringify(result, (key, value) => {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    });
    res.status(200).json(JSON.parse(jsonString));
})


app.post('/webhook', (req, res) => {
    const webhookPayload = req.body;
    const webhookSignature = req.get('x-square-signature');
    const webhookSignatureKey = "5TAW45fEonJNft1ppr-qjw"

    // const verifySquareWebhookSignature = (webhookPayload, webhookSignature, webhookSignatureKey) => {

    //     const expectedSignature = crypto.createHmac('sha1',webhookSignatureKey).update(JSON.stringify(webhookPayload)).digest('base64')
    //     console.log(Buffer.from(expectedSignature));
    //     console.log(Buffer.from(webhookSignature));
    //    console.log(crypto.timingSafeEqual(Buffer.from(expectedSignature ,'base64'),Buffer.from(webhookSignature)));
    //     return expectedSignature.length  ===  webhookSignature.length;
    // };

    // const isValidSignature =  verifySquareWebhookSignature(webhookPayload, webhookSignature, webhookSignatureKey);
    // console.log(isValidSignature);

    // if (webhooks.verifySignature(webhookPayload, webhookSignature)) {
    const eventType = webhookPayload.type;
    // console.log(webhookPayload.data.object.payment.status);

    if (eventType === 'PAYMENT_UPDATED' && webhookPayload.data.object.payment.status === 'COMPLETED') {
        console.log(webhookPayload.data.object.status);
        const paymentDetails = webhookPayload.data.object;
        console.log('Payment successfully completed', paymentDetails);
        res.json("Payment successfully completed", paymentDetails)
    }
    else {
        res.status(200).json('hello');
    }
})
// app.get('/authorize', (req, res) => {
//     const authUri = oauth.getAuthorizationUri({
//         scope: ['MERCHANT_PROFILE_READ', 'PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS'],
//         state: 'YOUR_STATE',
//     });

//     res.redirect(authUri);
// });


app.get('/oauth/callback', async (req, res) => {
    const code = req.query.code;
    console.log(code, '<<<<<<<<<<<<<,');
    try {
        const { result } = await oAuthApi.obtainToken({
            clientId: 'sandbox-sq0idb-xTWVAqLAG6Sb0DFxvsctZA',
            clientSecret: 'sandbox-sq0csb-yOetu9bMOHIjZ02PHvQU_MlD7uGg8ACFGNQweBhOlSM',
            code,
            grantType: 'authorization_code',
            redirectUri: 'http://localhost:3001/oauth/callback'
        });
        console.log(result);
        if (result) {
            res.redirect('http://localhost:5173/');
        }
    } catch (error) {
        console.log(error, '<<<<<<<<<<<<<,,,');
    }
})



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
