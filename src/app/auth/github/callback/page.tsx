'use client';

import {useState} from 'react';

export default function CallbackPage() {

    const [PAT, setPAT] = useState<string | null>(null);

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    // const {code, state} = url.searchParams;

    const fetchPAT = async () => {
        const res = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                client_id: "Ov23li7zIZz7TArt91TU",
                client_secret: "e10e25eca599fd71789e5332fefde1027a1f3ec8",
                code: code,
                redirect_uri: "http://localhost:3000/auth/github/callback",
            })
        });

        if (res.ok) {
            console.log("RES OK");
            const data = await res.json();
            setPAT(data.access_token);
            // postPAT(uid, PAT);
        } else {
            console.log(res.status);
        }
    }

    return (
        <>
            <p>{code}</p>
            <p>{PAT}</p>
        </>
    );
}