import { useEffect, useState } from "react";
import axios from "axios";
import URL from "./serverURL_link";

const proceedToPay = async (participants, isCashPayment, isContingentSelection) => {
    const paymentMode = isCashPayment ? "cash" : "online"
    const formattedData = { paymentMethod: paymentMode, eventsValues: participants, isContingentSelection: isContingentSelection }
    const data = await axios.post(`${URL}payment/orders`,
        formattedData,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

    return data.data;
}

const validatePaymet = async (responseData) => {
    const data = await axios.post(`${URL}payment/verifyOrder`, responseData, {
        headers: { "Content-Type": "application/json" },
    });

    return data;
}

export { validatePaymet, proceedToPay };
