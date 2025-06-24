const Question = require('../../schema/EventQuestionAndAnswers/EventQuestionsITManager.schema');

async function readQuestions(event) {
    const questions = await Question.find({ eventName: event })
        .lean()
        .select({ question: 1, options: 1, duration: 1 })
    return questions;
}

// to work on 
async function insertDataDuringStartUp(data) {
    const questions = await Question.find({});
    if (questions.length !== data.length) {
        await Question.deleteMany({});
        await Question.insertMany(data);
    }
    return
}

async function readAnswers(event) {
    const questions = await Question.find({ eventName: event })
        .lean()
        .select({ correctAnswer: 1, _id: 0 })

    return questions;
}

module.exports = {
    readQuestions,
    insertDataDuringStartUp,
    readAnswers,
}