const Coordinators = require('../../schema/Users/coordinator.schema');
const FacultyCoordinator = require('../../schema/Users/facultyCoordinator.schema');

async function getCoordinatorInfo(emailID) {
    return Coordinators.findOne({emailID: emailID});
}

async function getFacultyCoordinatorInfo(emailID) {
    return FacultyCoordinator.findOne({emailID: emailID});
}




module.exports = {
    getCoordinatorInfo,
    getFacultyCoordinatorInfo,
}