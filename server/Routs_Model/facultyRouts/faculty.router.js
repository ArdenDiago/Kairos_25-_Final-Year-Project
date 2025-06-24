const route = require("express").Router();
const { getFacultyInfo, postApprovial } = require("./faculty.controler");

route.get("/", getFacultyInfo);
route.post("/approval", postApprovial);

module.exports = route;
