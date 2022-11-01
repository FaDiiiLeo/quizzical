import React from "react";
import Question from "./components/Question";
import { nanoid } from "nanoid";
import he from "he";
import blueBlob from "./images/blob-blue.png";
import yellowBlob from "./images/blob-yellow.png";

function App() {

  const [quizData, setQuizData] = React.useState([]);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [isQuizStarted, setIsQuizStarted] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);

  const [quizOptions, setQuizOptions] = React.useState({
    amount: 5,
    category: "",
    difficulty: ""
  });

  function createQuizApiLink() {
    let quizApiLink = `https://opentdb.com/api.php?amount=${quizOptions.amount}`;
    if (quizOptions.category !== "") {
      quizApiLink += `&category=${quizOptions.category}`;
    }
    if (quizOptions.difficulty !== "") {
      quizApiLink += `&difficulty=${quizOptions.difficulty}`;
    }
    quizApiLink += `&type=multiple`;
    return quizApiLink;
  }

  async function getQuizData(e) {
    e.preventDefault();
    setIsDataLoading(true);
    const apiLink = createQuizApiLink();
    const response = await fetch(apiLink);
    const result = await response.json();
    if (result.response_code === 1) {
      setIsDataLoading(false);
      return alert('Something went wrong. Try again after changing some options.');
    }
    setQuizData(result.results);
    setIsDataLoading(false);
    setIsQuizStarted(true);
    setShowResult(false);
  }

  function createQuestions() {
    setQuestions(quizData.map(item => <Question
      key={nanoid()}
      question={item.question}
      correctAnswer={item.correct_answer}
      incorrectAnswers={item.incorrect_answers}
    />
    ));
  }

  React.useEffect(() => {
    createQuestions();
  }, [quizData]);

  const correctAnswers = quizData.map(item => he.decode(item.correct_answer));

  function calculateResults() {
    let numberOfCorrectChoices = 0;
    const selectedChoices = Array.from(document.querySelectorAll('.choice-selected'));
    selectedChoices.forEach(choice => {
      if (choice.className === 'choice-selected' && correctAnswers.includes(choice.textContent)) {
        numberOfCorrectChoices += 1;
      }
    });
    showAnswers();
    return numberOfCorrectChoices;
  }

  function showAnswers() {
    const allChoices = Array.from(document.querySelectorAll('.all-choices span'));
    allChoices.forEach(choice => {
      choice.style.pointerEvents = 'none';
      if (correctAnswers.includes(choice.textContent)) {
        choice.className = 'correct-choice';
      }
      else if (choice.className === 'choice-selected') {
        choice.className = 'wrong-choice';
      }
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setQuizOptions(prevState => {
      return {
        ...prevState,
        [name]: value
      }
    });
  }

  return (
    <div className="container">

      <img className={isQuizStarted ? "blue-blob_quiz-screen" : "blue-blob_start-screen"} src={blueBlob} alt="" />
      <img className={isQuizStarted ? "yellow-blob_quiz-screen" : "yellow-blob_start-screen"} src={yellowBlob} alt="" />

      {(!isQuizStarted && !isDataLoading) && <div className="start-screen">
        <h1 className="start-screen--heading">Quizzical</h1>
        <p className="start-screen--desc">Quiz will be created according to the selected options below.</p>
        <form onSubmit={getQuizData}>
          <div>
            <label htmlFor="numberOfQuestions">Select Number of Questions</label>
            <input
              id="numberOfQuestions"
              type="number"
              min="5"
              max="50"
              value={quizOptions.amount}
              name="amount"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="category">Select Category</label>
            <select
              id="category"
              name="category"
              value={quizOptions.category}
              onChange={handleChange}
            >
              <option value="">Any Category</option>
              <option value="9">General Knowledge</option>
              <option value="17">Science & Nature</option>
              <option value="18">Science: Computers</option>
              <option value="19">Science: Mathematics</option>
              <option value="21">Sports</option>
              <option value="22">Geography</option>
              <option value="23">History</option>
              <option value="26">Celebrities</option>
              <option value="27">Animals</option>
              <option value="28">Vehicles</option>
              <option value="11">Entertainment: Film</option>
              <option value="12">Entertainment: Music</option>
              <option value="15">Entertainment: Video Games</option>
              <option value="14">Entertainment: Television</option>
            </select>
          </div>
          <div>
            <label htmlFor="difficulty">Select Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={quizOptions.difficulty}
              onChange={handleChange}
            >
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button className="start-screen--btn btn">Start Quiz</button>
        </form>
      </div>}

      {isDataLoading && <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>} {/*Loading Animation*/}

      {isQuizStarted && <div className="quiz-screen">
        {questions}
      </div>}

      {(!showResult && isQuizStarted) && <button className="quiz-screen--btn btn" onClick={() => setShowResult(true)}>Check answers</button>}

      {(showResult && isQuizStarted) && <div className="result-section">
        <h4 className="result-text">You scored {calculateResults()}/{quizData.length} correct answers</h4>
        <button className="play-again-btn btn" onClick={() => setIsQuizStarted(false)}>Play Again</button>
      </div>}

    </div>
  );
}

export default App;
