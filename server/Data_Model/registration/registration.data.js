const mongoose = require("mongoose");
const OrderNo = require("../../schema/Payment/orderNO.schema");
const Teams = require("../../schema/registrationSchema/registration.schema");
const UserData = require("../../schema/Users/UserData.schema");
const { ObjectId } = mongoose.Types;

async function getEventRegistration(eventName) {
  console.log("Event Name: ", eventName);
  const orderInfo = await OrderNo.aggregate([
    {
      $match: {
        _id: { $in: eventName.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    },
    {
      $project: {
        // ✅ Select only specific fields from OrderNo
        _id: 0,
        orderNo: 1,
        emails: 1,
        emails: 1,
        paymentMethod: 1,
        participantsNotEntered: 1,
      },
    },
    {
      $lookup: {
        from: "userdatas", // ✅ Ensure correct collection name (lowercase by default)
        let: { orderEmails: "$emails" }, // Pass emails array from OrderNo
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  { $toLower: "$emailID" },
                  {
                    $map: {
                      input: "$$orderEmails",
                      as: "e",
                      in: { $toLower: "$$e" },
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              emailID: 1,
              name: 1,
              collegeName: 1,
              phoneNo: 1,
            },
          }, // ✅ Only return needed fields
        ],
        as: "participants",
      },
    },
  ]);

  console.log(JSON.stringify(orderInfo, null, 2));

  console.log("order Info: ", orderInfo);
  return orderInfo;
}

async function getEventRegistrationForCoordinators(eventId) {
  const data = await OrderNo.find().lean().select({ _id: 0, orderNo: 1, events: 1 });

  console.log("Data is: ", data);

  const filteredEvents = data.flatMap((item) => {
    const eventEntries = Object.entries(item.events);

    return eventEntries
      .filter(([eventName]) => eventName === eventId) // Keep matching events
      .map(([eventName, eventDetails], index) => {
        const key = eventEntries.length > 1 ? `${item.orderNo}_${index + 1}` : item.orderNo;
        return { [key]: eventDetails };
      });
  });

  console.log(filteredEvents);
  return filteredEvents;
}


module.exports = {
  getEventRegistration,
  getEventRegistrationForCoordinators,
};
