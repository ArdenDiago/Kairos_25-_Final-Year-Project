const Scores = require('../../schema/EventQuestionAndAnswers/Scores.schema');

async function insertScore(data) {
    const score = await Scores.create(data);
    return score;
}

// type TestResult = {
//   teamName: string
//   answers: Record<number, string>
//   score: number
//   totalQuestions: number
//   timestamp: string
// }

async function readEventScores(event) {
    const rawScores = await Scores.find({ event: event })
        .lean()
        .select({ teamName: 1, accuracyScore: 1, duration: 1, timestamp: 1, answers: 1, totalQuestions: 1, correctAnswers: 1 })
        .sort({ accuracyScore: -1 });

    const scores = rawScores.map(({ correctAnswers, ...rest }) => ({
        ...rest,
        score: correctAnswers,
    }))
    return scores;
}

module.exports = {
    insertScore,
    readEventScores,
};