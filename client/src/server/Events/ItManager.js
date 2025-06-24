import axios from "axios";

import URL from '../serverURL_link';

async function getQuestions() {
    const questions = await axios.get(`${URL}event/ITManager/ITManager`);
    console.log("Question log", questions.data);
    return questions.data;
}
async function postData(data) {
    console.log("Data is: ", data);
    const response = await axios.post(`${URL}event/ITManager/ITManager`, data);
    console.log("Post log", response.data);
    return response;
}

const fetchResultsFromServer = async () => {
  try {
    const response = await axios.get(`${URL}event/admin/ITManager`) // adjust the path to your backend
    console.log("Fetched results:", response.data)
    return response.data
  } catch (error) {
    console.error("Failed to fetch results:", error)
    return []
  }
}

export {
    getQuestions,
    postData,
    getQuestions as fetchQuestionsFromServer,
    fetchResultsFromServer,
}
