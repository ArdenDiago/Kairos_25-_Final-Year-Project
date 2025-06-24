const Event = require("../schema/Event.schema"); // Ensure your Event schema is correctly set up
const Score = require("../schema/Scores.schema");

async function getEventsData() {
  try {
    const allEvents = await Event.find({}) // Get all documents from the 'Event' collection
      .lean()
      .select("-_id -__v");

    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Return an empty array if there's an error
  }
}

async function addAllEvents(events, IDs) {
  try {
    // Check if any event with eventID in IDs exists
    const findEventData = await Event.find({ eventID: { $in: IDs } });
    const findScoreData = await Score.find({ eventID: { $in: IDs } });

    console.log("Found event data: ", findEventData, IDs);
    console.log("Found score data: ", findScoreData);

    // If not all events exist, delete and insert them
    if ((findEventData.length + findScoreData.length)  !== IDs.length) {
      if (findEventData.length > 0) {
        await Event.deleteMany({ eventID: { $in: IDs } });
      }

      console.log("Saving the Event to DB");
      await Event.insertMany(events, { timeout: 20000 });
    } else {
      console.log("Event Data already exists.");
    }

    // If not all scores exist, delete and insert them
    if (findScoreData.length !== IDs.length) {

      console.log("Delete the Scores: ", findScoreData.length, findScoreData);

      if (findScoreData.length >= 0) {
        console.log("Delete the Scores: ");
        await Score.deleteMany({});
      }

      console.log("Saving the Score Data to DB");
      console.log("Events for Scores: ", events);

      // Create score objects based on your schema structure
      const scores = events.map((event) => ({
        coordinator: event.studentCoordinator_1,
        id: event.eventName.toUpperCase(),
        name: event.eventType,
      }));

      await Score.insertMany(scores, { timeout: 10000 });
    } else {
      console.log("Score Data already exists.");
    }
  } catch (error) {
    console.error("Error fetching or saving events or score data:", error);
  }
}

async function getEventsDataByID(eventType) {
  const event = await Event.find({ eventType: eventType.toUpperCase() })
    .lean()
    .select({ _id: 0, __v: 0 });

  return event;
}

async function getAmountAndMinimumNoOfParticipants(eventID) {
  const eventAMT = await Event.find({ eventID: eventID.toUpperCase() })
    .lean()
    .select({ registrationFee: 1, maximumNoOfParticipants: 1 });

  if (!eventAMT.length) {
    return { amt: 0, maximumNoOfParticipants: 0 }; // Handle case where no data is found
  }

  return {
    amt: eventAMT[0].registrationFee,
    maximumNoOfParticipants: eventAMT[0].maximumNoOfParticipants,
  };
}

module.exports = {
  getEventsData,
  getAmountAndMinimumNoOfParticipants,
  getEventsDataByID,
  addAllEvents,
};
