const { checkFacultySessionInfo } = require("../../utils/userSessionRetrevial");
const {
  getEventByLable,
  updateTheDB_WithScores,
  getStudentFlag,
} = require("../../Data_Model/score");

async function getFacultyInfo(req, res) {
  try {
    const userExist = await checkFacultySessionInfo(req.session);

    console.log("1 User Data: is", userExist);

    if (!userExist) {
      return res.status(400).json("Error to sign it?");
    }

    console.log("User Data: is", userExist);
    const scores = await getEventByLable(userExist.eventType);

    if (!scores) {
      return res.status(400).json("No scores found");
    }

    console.log("scores are: ", scores);

    return res
      .status(200)
      .json({
        userData: {
          name: userExist.name,
          emailID: userExist.emailID,
          eventType: userExist.eventType,
        },
        scores,
      });
  } catch (err) {
    console.error("Error in getting the faculty info: ", err);
    res.status(500).json({ message: "Error in getting faculty info: ", err });
  }
}

async function postApprovial(req, res) {
  try {
    const userExist = await checkFacultySessionInfo(req.session);

    console.log("1 User Data:", userExist);

    if (!userExist) {
      return res.status(401).json({ error: "Unauthorized: Session invalid." });
    }

    const data = req.body;
    console.log("Data is:", data);

    const modes = ["approval", "rejected"];

    if (!modes.includes(data.status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status mode." });
    }

    const updatedData = {
      id: data.id,
      facultySubmitted: data.status.toLowerCase() === "approval",
    };

    const getStudentFlagVar = await getStudentFlag(data.id);

    if (getStudentFlagVar.studentSubmitted) {
      const finalData = await updateTheDB_WithScores(updatedData);
      console.log("Final Data Logged: ", finalData)
      return res.status(200).json(finalData);
    }

    return res.status(400).json("Error to do it");
  } catch (err) {
    console.error("Error in Approval:", err);
    return res.status(500).json({ error: "Server error while approving." });
  }
}

module.exports = {
  getFacultyInfo,
  postApprovial,
};
