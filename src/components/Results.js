import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Results = () => {
    const [quizData, setQuizData] = useState(null);
    const navigate = useNavigate();

    // Function to go back to the last step
    const handleBack = () => {
        // Assuming the last step was step 6 (you can adjust this based on your quiz)
        navigate('/step/6');
    };

    // Function to restart the quiz
    const handleRestart = () => {
        // Clear quiz data from localStorage
        localStorage.removeItem('quizData');

        // Redirect to the first step of the quiz
        navigate('/step/1');
    };

    useEffect(() => {
        const storedData = localStorage.getItem('quizData');
        if (storedData) {
            setQuizData(JSON.parse(storedData));
        } else {
            // Redirect to quiz if no data is found
            navigate('/');
        }
    }, [navigate]);

    const recommendFood = () => {
        if (!quizData) return '';

        const {age, weight, foodPreferences, allergies} = quizData;

        let recommendation = 'Balanced Diet ';

        if (age < 1) {
            recommendation += 'with more Protein for kittens';
        } else if (age > 8) {
            recommendation += 'with focus on Joint Health for seniors';
        }

        if (weight > 5) {
            recommendation += ', Low-calorie food for weight management';
        }

        if (allergies) {
            recommendation += `, Avoid products with ${allergies}`;
        }

        recommendation += `, Preferred taste: ${foodPreferences}`;
        return recommendation;
    };

    return (
        <div>
            {quizData ? (
                <div className="quiz-results">
                    <h2>Recommended Food for {quizData.name}</h2>
                    <p>{recommendFood()}</p>

                    <div className="buttons">
                        <button onClick={handleBack}>
                            Back
                        </button>
                        <button onClick={handleRestart}>
                            Restart Quiz
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading results...</p>
            )}
        </div>
    );
};

export default Results;
