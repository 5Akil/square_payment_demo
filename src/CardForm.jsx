import { useEffect } from "react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";

export default function CardForm() {
    function redirectToSquare() {
console.log("clicked");
        const oauthUrl = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=sandbox-sq0idb-_MbctWw8OsMSQP1TQofrNA&scope=CUSTOMERS_WRITE+CUSTOMERS_READ+MERCHANT_PROFILE_READ+PAYMENTS_READ+PAYMENTS_WRITE+PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS&session=false&redirect_uri=http://localhost:3001/oauth/callback`;

        // Redirect the user to the Square OAuth page
        window.location.href = oauthUrl;
    }
    // useEffect(() => {
        console.log(window.location);
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        const authorizationCode = urlParams.get('code');
        if (authorizationCode) {
            console.log(authorizationCode);
            // Display a success message
            // window.location.href = `http://localhost:3001/`
        }
    // }, [])

    return (
        <div >
            <PaymentForm
                applicationId="sandbox-sq0idb-rIxlEk_uoOmy7NcQB1twew"
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                    console.log('token:', token);
                    console.log('verifiedBuyer:', verifiedBuyer);
                    const response = await fetch("http://localhost:3001/api/pay", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            sourceId: token.token,
                        }),
                    });
                    console.log(await response.json(), ',,,,,,,,,,,,,,');
                }}
                locationId='XXXXXXXXXX'
            >
                <CreditCard />

            </PaymentForm>
                <button onClick={() => redirectToSquare()}>Authorize with Square</button>
        </div>
    )
}