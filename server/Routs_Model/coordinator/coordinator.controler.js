const {
  checkCoordinatorSessionInfo,
} = require("../../utils/userSessionRetrevial");

const {
  getEventRegistrationForCoordinators,
} = require("../../Data_Model/registration/registration.data");


const {
  updateTheDB_WithScores
} = require("../../Data_Model/score");
// const {
//   checkCoordinatorSessionInfo,
// } = require("../../utils/userSessionRetrevial");

async function getCoordinatorInfo(req, res) {
  try {
    const info = await checkCoordinatorSessionInfo(req.session);
    console.log(info);

    if (!info) {
      return res.status(400).json("Error in use Info");
    }

    return res.status(200).json({
      coordinatorName: info.name || "", // This ensures a default empty string if name is falsy
      coordinatorEmail: info.emailID,
      coordinatorEvent: info.eventID,
      eventRounds: info.roundsArray,
    });
  } catch (err) {
    console.log("Error to get Coordinator Info: ", err);
    return res.status(500).json("Internet Error");
  }
}

async function getEventParticipants(req, res) {
  try {
    const info = await checkCoordinatorSessionInfo(req.session);
    console.log(info);
    const data = await getEventRegistrationForCoordinators(info.eventID);

    if (!data) {
      return res.status(400).json("No Event Found");
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error to get participants Registration: ", err);
    return res.status(500).json("Erro to get participants info");
  }
}

async function postCoordinatorResults(req, res) {
  try {
    const userInfo = await checkCoordinatorSessionInfo(req.session);
    
    console.log("User info: 1");
    
    if (!userInfo) {
      return res.status(400).json("User Not found");
    }

    const data = req.body;
    
    console.log("Body info: 1");
    console.log("Data: ", data);

    if (!data) {
      return res.status(400).json("Data not yet Entered");
    }

    console.log("check info: 1");

    const finalData = {
      ...data,
      studentSubmitted: true,
    };


    const addEventsToDB = await updateTheDB_WithScores(finalData);

    console.log("added Events: ", addEventsToDB);

    return res.status(200).json(addEventsToDB);
  } catch (err) {
    console.error("Error in posting the data: ", err);
    return res.status(500);
  }
}

module.exports = {
  getCoordinatorInfo,
  getEventParticipants,
  postCoordinatorResults,
};
