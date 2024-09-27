import React, {useState, useEffect, useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const QuizSteps = () => {
    const {stepNumber} = useParams();
    const navigate = useNavigate();

    const initialData = useMemo(() => [
        {
            name: '',
            age: '',
            breed: '',
            otherBreed: '',
            weight: '',
            allergies: '',
            foodPreferences: ''
        }
    ], []);

    const [quizData, setQuizData] = useState(() => {
        const storedData = localStorage.getItem('quizData');
        return storedData ? JSON.parse(storedData) : initialData;
    });

    useEffect(() => {
        if (!Array.isArray(quizData)) {
            setQuizData(initialData);
        }
        localStorage.setItem('quizData', JSON.stringify(quizData));
    }, [quizData, initialData]);

    const handleInputChange = (index, e) => {
        const {name, value} = e.target;
        const updatedQuizData = [...quizData];
        updatedQuizData[index][name] = value;
        setQuizData(updatedQuizData);
    };

    const addPet = () => {
        setQuizData([...quizData, {
            name: '',
            age: '',
            breed: '',
            otherBreed: '',
            weight: '',
            allergies: '',
            foodPreferences: ''
        }]);
    };

    const removePet = (index) => {
        const updatedQuizData = quizData.filter((_, i) => i !== index);
        setQuizData(updatedQuizData);
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
        navigate('/results');
    };

    const isNextDisabled = () => {
        return quizData.some(petData => {
            switch (parseInt(stepNumber)) {
                case 1:
                    return !petData.name;
                case 2:
                    return !petData.age;
                case 3:
                    if (petData.breed === 'Other') {
                        return !petData.otherBreed;
                    }
                    return !petData.breed;
                case 4:
                    return !petData.weight;
                case 5:
                    return false;
                case 6:
                    return !petData.foodPreferences;
                default:
                    return false;
            }
        });
    };

    const renderStep = (index) => {
        const petData = quizData[index];
        const catName = petData.name || 'your cat';

        switch (parseInt(stepNumber)) {
            case 1:
                return (
                    <div key={index} className="step">
                        <div className="header">
                            <h2>What is your cat's name?</h2>
                            {index > 0 && (
                                <div className="remove">
                                    <button className="button button-bordered button-small button-error"
                                            onClick={() => removePet(index)}>×
                                    </button>
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Cat's Name"
                            value={petData.name}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                );
            case 2:
                return (
                    <div key={index} className="step">
                        <div className="header">
                            <h2>What is {catName}'s age?</h2>
                        </div>
                        <input
                            type="number"
                            name="age"
                            placeholder="Cat's Age"
                            value={petData.age}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                );
            case 3:
                return (
                    <div key={index} className="step">
                        <div className="header">
                            <h2>What is {catName}'s breed?</h2>
                        </div>
                        <select
                            name="breed"
                            value={petData.breed}
                            onChange={(e) => handleInputChange(index, e)}
                        >
                            <option value="" disabled hidden>Please select</option>
                            <option value="Persian">Persian</option>
                            <option value="Maine Coon">Maine Coon</option>
                            <option value="Siamese">Siamese</option>
                            <option value="Ragdoll">Ragdoll</option>
                            <option value="Sphynx">Sphynx</option>
                            <option value="British Shorthair">British Shorthair</option>
                            <option value="Other">Other</option>
                        </select>
                        {petData.breed === 'Other' && (
                            <input
                                type="text"
                                name="otherBreed"
                                placeholder="Other Breed"
                                value={petData.otherBreed}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                        )}
                    </div>
                );
            case 4:
                return (
                    <div key={index} className="step">
                        <div className="header">
                            <h2>What is {catName}'s weight (kg)?</h2>
                        </div>
                        <input
                            type="number"
                            name="weight"
                            placeholder={`${catName}'s Weight`}
                            value={petData.weight}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                );
            case 5:
                return (
                    <div key={index} className="step">
                        <div className="header">
                            <h2>Does {catName} have any allergies?</h2>
                        </div>
                        <input
                            type="text"
                            name="allergies"
                            placeholder="Allergies"
                            value={petData.allergies}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                );
            case 6:
                return (
                    <div key={index} className="step">
                        <div className="header">
                            <h2>What are {catName}'s food preferences?</h2>
                        </div>
                        <input
                            type="text"
                            name="foodPreferences"
                            placeholder="E.g. Chicken, Fish, etc."
                            value={petData.foodPreferences}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                    </div>
                );
            default:
                return <div key={index}>Unknown Step</div>;
        }
    };

    const progress = (parseInt(stepNumber) / 6) * 100;

    return (
        <>
            <div className="quiz-steps">
                <div className="progress" style={{width: '100%', backgroundColor: '#e0e0e0'}}>
                    <div style={{width: `${progress}%`, backgroundColor: '#000000', height: '2px'}}/>
                </div>
                {quizData.map((_, index) => renderStep(index))}
            </div>
            <div className="buttons">
                {parseInt(stepNumber) === 1 &&
                    <button className="button button-bordered" onClick={addPet} disabled={quizData.length >= 4}>+ Add
                        Cat</button>}
                {parseInt(stepNumber) > 1 &&
                    <button className="button button-bordered" onClick={prevStep}>Back</button>}
                {parseInt(stepNumber) < 6 && <button onClick={nextStep} disabled={isNextDisabled()}>Next</button>}
                {parseInt(stepNumber) === 6 && <button onClick={submitQuiz} disabled={isNextDisabled()}>Submit</button>}
            </div>
        </>

    )
        ;
};

export default QuizSteps;
