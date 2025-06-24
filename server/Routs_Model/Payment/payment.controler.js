const Razorpay = require('razorpay');
const crypto = require('crypto');

require('dotenv').config();

const { DateTime } = require('luxon');

const { bulkUserCheckIn, addUser, addOrderNoToUsersArray } = require('../../Data_Model/user.data');
const { generateOrderNo, addOrdersDetails, orderSchemaID, addVerifiedData, addOrderNoToUser } = require('../../Data_Model/Payment/payment.data')
const { getAmountAndMinimumNoOfParticipants } = require('../../Data_Model/events.data');
const { checkUserSessionInfo } = require('../../utils/userSessionRetrevial');
const { addRegistredTeams, updatePaymentStatus } = require('../../Data_Model/Payment/registration.data');

// keys for different environments
const { Razorpay_key, Razorpay_secret, } = require('../../utils/environmentalVariables');


// razorpay configerations
const razorpayConfig = {
    key_id: Razorpay_key,
    key_secret: Razorpay_secret
}

// initialization of razorpay
const razorpay = new Razorpay({
    ...razorpayConfig
})

// returns the amount, key of the event and the participants emailIDs.
async function storeUserAndGenerateAmount(key, values) {
    let amount = 0, emails, emailListWithKeys = {};
    const { amt, maximumNoOfParticipants } = await getAmountAndMinimumNoOfParticipants(key);

    console.log("Key and amount: ", amt, key, values, typeof values)

    if (Array.isArray(values)) {
        const data = values.map(value => value.emailID.toLowerCase());

        amount = amt;
        emails = data
        emailListWithKeys[key] = data;

        console.log("Emails", data);

        if (data.length > maximumNoOfParticipants) {
            throw new Error("Maximum Participants limit");
        }

    } else if (typeof values === "object") {
        let teams = {}, masterEmail = [];

        console.log("Values fed to the obj: ", values);

        Object.entries(values).forEach(([teamName, participants]) => {
            console.log("In the Object: ", teamName, participants);

            // Extract emails correctly
            const data = participants.map(value => value.email.toLowerCase());

            // Validate participant count
            if (data.length > maximumNoOfParticipants) {
                throw new Error("Maximum Participants limit exceeded.");
            }

            amount += amt;
            masterEmail.push(...data);  // Flatten the array instead of nesting
            teams[teamName] = data;  // Store each team's emails
        });

        emails = masterEmail;
        emailListWithKeys = teams;

        console.log("Emails", emails);
        console.log("Emails With Keys: ", emailListWithKeys);

        return { amount, key, emails, emailListWithKeys };
    }
}
// generate order
// generateOrder(paymentMethod, totalAmount, emailIdAndKey, _id, userInfo, notesDetails, flattenEmails)
async function generateOrder(paymentMethod, eventAmount, emailIdAndKey, emailID, userInfo, notes, participantsEmails) {
    try {
        console.log("\n\nEmails with key in General Orders: ", emailIdAndKey);
        const { orderNo, _id } = await generateOrderNo(emailIdAndKey, paymentMethod, participantsEmails);

        // Add registred Data to the master Registration Table
        let masterTableData = [];
        Object.entries(emailIdAndKey).forEach(([key, value]) => {
            const keys = Object.keys(value);

            if (keys.length > 1) {
                keys.forEach((teamKey) => {  // Use forEach instead of map
                    const teamInfo = {
                        eventName: key,
                        orderID: _id,  // Ensure _id is defined before this
                        teamName: `${key}_${orderNo}_${teamKey}`,
                        teamDetails: value[teamKey] // Use 'value' instead of accessing emailIdAndKey[key][teamKey]
                    };
                    masterTableData.push(teamInfo);
                });
            } else {
                const data = {
                    eventName: key,
                    orderID: _id,  // Ensure _id is defined
                    teamName: `${key}_${orderNo}`,
                    teamDetails: value[keys] // Directly assign value instead of emailIdAndKey[key]
                };
                masterTableData.push(data);
            }

            console.log("The Value is: ", key, value);
        });

        const addDataToMasterTable = await addRegistredTeams(masterTableData);
        console.log("Data added to MasterTable: ", addDataToMasterTable)

        // remove
        // Generate a unique receipt number
        const receiptNo = `Kairos_${orderNo}_${DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss')}`;
        console.log("outside the order Generation PS: ", orderNo, _id);
        const amount = eventAmount;
        console.log(amount, receiptNo, emailIdAndKey)
        // Create Razorpay order
        const orderID = await razorpay.orders.create({
            amount: amount,
            receipt: receiptNo,
            notes: JSON.stringify(emailIdAndKey),
        });
        console.log(orderID);

        const updateUsersData = await addOrderNoToUsersArray(_id, participantsEmails);
        console.log("Update user Data: ", updateUsersData);

        if (!orderID || !orderID.id) {
            throw new Error("Razorpay order creation failed");
        }


        const options = {
            orderNo: orderNo,
            paymentMethod: paymentMethod,
            amount: amount,
            notes: JSON.stringify(emailIdAndKey),
            emailID: emailID,
        };
        await addOrdersDetails(options);
        console.log("Sending to frontend: Cash: ", options);

        if (paymentMethod.toLowerCase() === "cash") {
            return options;
        }
        else {
            return options           
       }

    } catch (err) {
        console.error("Error in order generation: ", err);
        throw new Error("Error occurred in generating the order");
    }
}


async function generateOrderDetails(req, res) {
    try {
        const isExists = await checkUserSessionInfo(req.session);
        const { paymentMethod, eventsValues, isContingentSelection } = req.body;

        console.log("User Exist: ", isExists, paymentMethod, eventsValues);

        if (!isExists) {
            return res.status(400).json({ message: "Error: User not logged in" });
        }
        console.log('In the isuser method');

        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment Method Not found" });
        }
        console.log('In the payment Method');
        const { collegeName, emailID, phoneNo, name, _id } = isExists;

        let totalAmount = 0, flattenEmails = [];
        const allEmailsIDs = []
        const emailIdAndKey = {};
        const eventsKeys = Object.keys(eventsValues).filter(event => event !== "emailID" && event != "paymentMethod" && event !== "collegeName");

        for (const event of eventsKeys) {

            const { amount, key, emails, emailListWithKeys } = await storeUserAndGenerateAmount(event, eventsValues[event]);

            console.log("AMT: ", amount, "Email: ", emails, "Email with keys", emailListWithKeys)

            totalAmount += amount;
            emailIdAndKey[event] = emailListWithKeys;
            allEmailsIDs.push(emails);

            // Check existing users
            const flattenEmailsList = emails.flat(Infinity);
            flattenEmails.push(...flattenEmailsList);
            const bulkCheckIn = await bulkUserCheckIn(flattenEmailsList);

            console.log("Bulk CheckIN: ", bulkCheckIn);
            if (bulkCheckIn.length !== emails.length) {
                const existingUserIds = bulkCheckIn.map(user => user.emailID.toLowerCase());
                const missingUserIds = flattenEmailsList.filter(id => !existingUserIds.includes(id));

                console.log("Getting the BuilCheckIn Insigts: ", missingUserIds);
                for (const missingUser of missingUserIds) {
                    console.log("email and missing user: ", emails, missingUserIds);

                    let indexedValue = [];

                    if (Array.isArray(eventsValues[event])) {
                        console.log("Participants are: in the Array: ", eventsValues[event]);
                        indexedValue = eventsValues[event].filter(member =>
                            member.email && member.email.toLowerCase() === missingUser.toLowerCase()
                        );

                    } else {
                        Object.entries(eventsValues[event]).forEach(([teamName, participants]) => {
                            console.log("Participants are: in the Obj: ", participants);

                            const filteredParticipants = participants.filter(member => {
                                console.log("members Missing", member, member.email, missingUser);
                                return member.email && member.email.toLowerCase() === missingUser.toLowerCase();
                            });

                            indexedValue.push(...filteredParticipants);
                        });
                    }

                    console.log("Final Indexed Value:", indexedValue);

                    indexedValue.map(async (data) => {
                        const val = {
                            name: data.name || '',
                            emailID: data.email.toLowerCase(),
                            phoneNo: data.phone || '',
                            collegeName: collegeName,
                        }
                        await addUser(val);
                    })
                }

            }
        }

        if (isContingentSelection) {
            totalAmount = 3000;
        }

        const userInfo = {
            contact: phoneNo,
            name: name,
            email: emailID,
        };

        const notesDetails = {
            description: 'Participated in Kairos',
            events: `Participated in Events like: ${eventsKeys.join(", ")}`
        };

        console.log("EVENT AMOUNT", totalAmount, isContingentSelection, emailIdAndKey);

        const order = await generateOrder(paymentMethod, totalAmount, emailIdAndKey, _id, userInfo, notesDetails, flattenEmails);

        return res.status(200).json(order);
    } catch (err) {
        console.error('Error in Generating the Order: ', String(err));
        return res.status(500).json({ message: "Error in generating the order", error: String(err) });
    }
}




function createHMAC_Hash(orderID, paymentID) {
    const hmac = crypto.createHmac('sha256', razorpayConfig.key_secret);
    hmac.update(`${orderID}|${paymentID}`);
    const generatedSigniture = hmac.digest('hex');
    return generatedSigniture
}

async function verifySignature(req, res) {
    // Used to verify the details received from the front end
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Check if required fields are missing
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ error: "Missing payment details" });
        }

        // Generate the signature from Razorpay order_id and payment_id
        const signature = createHMAC_Hash(razorpay_order_id, razorpay_payment_id);

        // Fetch the order from your database (adjust the function as needed)
        const orderID = await orderSchemaID(razorpay_order_id);

        // Prepare verified order data
        let verifiedOrder = {
            razorpay_payment_id: razorpay_payment_id,
            orderId: orderID._id,
            razorpay_signature: razorpay_signature,
            status: null,
        };

        // Check if the generated signature matches the Razorpay signature
        if (signature === razorpay_signature) {
            verifiedOrder.status = true;
            const { _id, emails } = await addOrderNoToUser(orderID._id);
            const updateUsersData = await addOrderNoToUsersArray(_id, emails);
            const updateStatus = await updatePaymentStatus(orderID.orderNo);
            console.log(updateUsersData);
            console.log("Updated Status: ", updateStatus);
        } else {
            verifiedOrder.status = false;
        }

        // Add verified order details to the database (adjust function as needed)
        const data = await addVerifiedData(verifiedOrder);


        // Return the response
        res.status(verifiedOrder.status ? 200 : 400).json({
            status: verifiedOrder.status ? 'Payment Successful' : 'Payment Failed',
            ID: data,
        });

    } catch (err) {
        console.error('Error: ', err);
        return res.status(400).json({ error: err.message, path: "/payment/verifyOrder" });
    }
}


module.exports = {
    generateOrderDetails,
    verifySignature,
}