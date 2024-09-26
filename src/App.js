import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import QuizSteps from './components/QuizSteps';
import Results from './components/Results';
import './App.css';

function App() {
    const [quizData, setQuizData] = useState({});

    useEffect(() => {
        const storedData = localStorage.getItem('quizData');
        if (storedData) {
            setQuizData(JSON.parse(storedData));
        }
    }, []);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Redirect to Step 1 if the root is accessed */}
                    <Route path="/" element={<Navigate to="/step/1"/>}/>
                    {/* Route for each step */}
                    <Route path="/step/:stepNumber" element={<QuizSteps/>}/>
                    <Route path="/results" element={<Results quizData={quizData}/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
