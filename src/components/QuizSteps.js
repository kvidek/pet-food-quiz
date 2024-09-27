import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const QuizSteps = () => {
    const {stepNumber} = useParams(); // Get the current step from URL
    const navigate = useNavigate();

    const initialData = {
        name: '',
        age: '',
        breed: '',
        otherBreed: '',
        weight: '',
        allergies: '',
        foodPreferences: ''
    };

    // Load quiz data from localStorage, or use default initialData
    const [quizData, setQuizData] = useState(() => {
        const storedData = localStorage.getItem('quizData');
        return storedData ? JSON.parse(storedData) : initialData;
    });

    // Store quiz data in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('quizData', JSON.stringify(quizData));
    }, [quizData]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setQuizData({
            ...quizData,
            [name]: value
        });
    };

    const nextStep = () => {
        navigate(`/step/${parseInt(stepNumber) + 1}`);
    };

    const prevStep = () => {
        if (stepNumber > 1) {
            navigate(`/step/${parseInt(stepNumber) - 1}`);
        }
    };

    const submitQuiz = () => {
        // Redirect to the results page
        navigate('/results');
    };

    // If the cat's name is available, use it in the questions
    const catName = quizData.name || 'your cat';

    const totalSteps = 6;
    const progress = (parseInt(stepNumber) / totalSteps) * 100;

    // Validation to enable/disable "Next" button
    const isNextDisabled = () => {
        switch (parseInt(stepNumber)) {
            case 1:
                return !quizData.name; // Require name
            case 2:
                return !quizData.age; // Require age
            case 3:
                if (quizData.breed === 'Other') {
                    return !quizData.otherBreed; // Require 'other breed' if 'Other' is selected
                }
                return !quizData.breed; // Require breed
            case 4:
                return !quizData.weight; // Require weight
            case 5:
                return false; // Allow allergies to be empty
            case 6:
                return !quizData.foodPreferences; // Require food preferences
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (parseInt(stepNumber)) {
            case 1:
                return (
                    <div className="step">
                        <div className="header">
                            <p>Step 1</p>
                            <h2>Your Cat's Name</h2>
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Cat's Name"
                            value={quizData.name}
                            onChange={handleInputChange}
                        />
                        <div className="buttons">
                            <button onClick={nextStep} disabled={isNextDisabled()}>Next</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step">
                        <div className="header">
                            <p>Step 2</p>
                            <h2>How old is {catName}?</h2>
                        </div>
                        <input
                            type="number"
                            name="age"
                            placeholder={`${catName}'s Age`}
                            value={quizData.age}
                            onChange={handleInputChange}
                        />
                        <div className="buttons">
                            <button className="button button-bordered" onClick={prevStep}>Back</button>
                            <button onClick={nextStep} disabled={isNextDisabled()}>Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step">
                        <div className="header">
                            <p>Step 3</p>
                            <h2>What is {catName}'s breed?</h2>
                        </div>
                        <select
                            name="breed"
                            value={quizData.breed}
                            placeholder="Select a breed"
                            onChange={handleInputChange}
                        >
                            <option value="Persian">Persian</option>
                            <option value="Maine Coon">Maine Coon</option>
                            <option value="Siamese">Siamese</option>
                            <option value="Ragdoll">Ragdoll</option>
                            <option value="Sphynx">Sphynx</option>
                            <option value="British Shorthair">British Shorthair</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Show input for 'Other' breed only if 'Other' is selected */}
                        {quizData.breed === 'Other' && (
                            <input
                                type="text"
                                name="otherBreed"
                                placeholder="Please specify breed"
                                value={quizData.otherBreed}
                                onChange={handleInputChange}
                            />
                        )}
                        <div className="buttons">
                            <button className="button button-bordered" onClick={prevStep}>Back</button>
                            <button onClick={nextStep} disabled={isNextDisabled()}>Next</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step">
                        <div className="header">
                            <p>Step 4</p>
                            <h2>What is {catName}'s weight (kg)?</h2>
                        </div>
                        <input
                            type="number"
                            name="weight"
                            placeholder={`${catName}'s Weight`}
                            value={quizData.weight}
                            onChange={handleInputChange}
                        />
                        <div className="buttons">
                            <button className="button button-bordered" onClick={prevStep}>Back</button>
                            <button onClick={nextStep} disabled={isNextDisabled()}>Next</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step">

                        <div className="header">
                            <p>Step 5</p>
                            <h2>Does {catName} have any allergies?</h2>
                        </div>
                        <input
                            type="text"
                            name="allergies"
                            placeholder="Allergies"
                            value={quizData.allergies}
                            onChange={handleInputChange}
                        />
                        <div className="buttons">
                            <button className="button button-bordered" onClick={prevStep}>Back</button>
                            <button onClick={nextStep}>Next</button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="step">

                        <div className="header">
                            <p>Step 6</p>
                            <h2>What are {catName}'s food preferences?</h2>
                        </div>
                        <input
                            type="text"
                            name="foodPreferences"
                            placeholder="E.g. Chicken, Fish, etc."
                            value={quizData.foodPreferences}
                            onChange={handleInputChange}
                        />
                        <div className="buttons">
                            <button className="button button-bordered" onClick={prevStep}>Back</button>
                            <button onClick={submitQuiz} disabled={isNextDisabled()}>Submit</button>
                        </div>
                    </div>
                );
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="quiz-steps">
            <div className="progress" style={{width: '100%', backgroundColor: '#e0e0e0'}}>
                <div style={{width: `${progress}%`, backgroundColor: '#000000', height: '2px'}}/>
            </div>
            {renderStep()}
        </div>
    );
};

export default QuizSteps;
