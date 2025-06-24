const mongoose = require("mongoose");

const getInHouseRolesSchema = () =>
  require("../../schema/Users/inHouseRoles.schema");
const getCoordinatorSchema = () =>
  require("../../schema/Users/coordinator.schema");
const getFacultyCoordinator = () =>
  require("../../schema/Users/facultyCoordinator.schema");

const addInHouseUsers = async (userInfo) => {
  try {
    const InHouseRoles = getInHouseRolesSchema();
    const Coordinator = getCoordinatorSchema();
    const FacultyCoordinator = getFacultyCoordinator();

    const userCount = await InHouseRoles.countDocuments().maxTimeMS(30000);
    const coordinatorCount = await Coordinator.countDocuments().maxTimeMS(
      30000
    );
    const facultyCoordinator =
      await FacultyCoordinator.countDocuments().maxTimeMS(30000);
    console.log("Coordinator Model Debug:", Coordinator);

    console.log("Hiii", userInfo);

    if (userCount !== userInfo.length) {
      if (userCount > 0) {
        await InHouseRoles.deleteMany({});
        await Coordinator.deleteMany({});
        await FacultyCoordinator.deleteMany({});
      }

      let inHouseUserData = [];
      let coordinatorData = [];
      let facultyData = [];

      userInfo.forEach((user) => {
        if (user.hasOwnProperty("eventID")) {
          coordinatorData.push({
            name: user.name,
            emailID: user.emailID,
            roundsArray: user.roundsArray,
            eventID: user.eventID.toUpperCase(),
          });
        } else if (user.userRole === "facultyCoordinator") {
          facultyData.push({
            name: user.name,
            emailID: user.emailID,
            eventType: user.eventType,
          });
        } else {
          inHouseUserData.push({
            emailID: user.emailID,
            userRole: user.userRole,
          });
        }
      });

      console.log("Coordinator Data:", coordinatorData);
      console.log("In-House User Data:", inHouseUserData);

      if (inHouseUserData.length > 0) {
        await InHouseRoles.insertMany(inHouseUserData);
      }

      if (coordinatorData.length > 0) {
        await Coordinator.insertMany(coordinatorData);
      }

      if (facultyData.length > 0) {
        await FacultyCoordinator.insertMany(facultyData);
      }
    } else {
      console.log("No Need to add new Users");
      return null;
    }
  } catch (error) {
    console.error("Error adding in-house users:", error);
  }
};

module.exports = { addInHouseUsers };
