import React from "react";
import he from "he";
import { nanoid } from 'nanoid';

function Question(props) {

    const allChoicesShuffled = [props.correctAnswer, ...props.incorrectAnswers].map(choice => {
        return {
            id: nanoid(),
            choice: choice,
            isSelected: false
        }
    }).sort(() => Math.random() - 0.5);

    const [choices, setChoices] = React.useState(allChoicesShuffled);

    function choiceSelected(event) {
        setChoices(prevChoices => {
            return prevChoices.map(choice => choice.id === event.target.id
                ? { ...choice, isSelected: !choice.isSelected }
                : { ...choice, isSelected: false });
        });
    }

    const choicesElements = choices.map(choice => {
        return <span
            id={choice.id}
            className={choice.isSelected ? "choice-selected" : "choice"}
            key={nanoid()}
            onClick={choiceSelected}
        >{he.decode(choice.choice)}</span>
    });

    return (
        <section className="question-container">
            <h2 className="question">{he.decode(props.question)}</h2>
            <div className="all-choices">
                {choicesElements}
            </div>
            <hr />
        </section>
    );
}

export default Question;