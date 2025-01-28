import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF
import './Quiz.css';

const Quiz = () => {
    const [languages, setLanguages] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);

    useEffect(() => {
        const fetchLanguages = async () => {
            const response = await axios.get('https://localhost:7190/api/Notes/ProgrammingLanguageDropDown');
            setLanguages(response.data);
        };
        fetchLanguages();
    }, []);

    const handleLanguageChange = async (e) => {
        const languageId = e.target.value;
        setSelectedLanguage(languageId);

        const response = await axios.get(`https://localhost:7190/api/Quizzes/questions/${languageId}`);
        setQuestions(response.data);
        setCurrentQuestionIndex(0);
        setIsSubmitted(false);
        setAnswers({});
        setScore(0);
        setCorrectAnswers([]);
        setRecommendedJobs([]);
    };

    const handleAnswerChange = (questionId, selectedOptionId) => {
        setAnswers({ ...answers, [questionId]: selectedOptionId });
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }

        const userId = localStorage.getItem('userId');
        const answerList = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
            QuestionId: parseInt(questionId),
            SelectedOptionId: selectedOptionId,
        }));

        try {
            const response = await axios.post(
                'https://localhost:7190/api/Quizzes/submit',
                { UserId: userId, Answers: answerList },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setScore(response.data.score);
            setIsSubmitted(true);
            setRecommendedJobs(response.data.recommendedJobs);

            const correctAnswersList = questions.map((q) => {
                const correctOption = q.options.find((o) => o.isCorrect);
                return { questionId: q.id, correctOptionId: correctOption ? correctOption.id : null };
            });
            setCorrectAnswers(correctAnswersList);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Quiz Results', 20, 20);

        doc.setFontSize(12);
        doc.text(`Score: ${score} out of ${questions.length}`, 20, 40);

        let yOffset = 60;
        questions.forEach((question) => {
            const userAnswer = answers[question.id];
            const correctOption = question.options.find((o) => o.isCorrect);

            doc.text(`Question: ${question.text}`, 20, yOffset);
            doc.text(`Your Answer: ${question.options.find((o) => o.id === userAnswer)?.text || 'None'}`, 20, yOffset + 10);
            doc.text(`Correct Answer: ${correctOption?.text || 'None'}`, 20, yOffset + 20);
            yOffset += 40;
        });

        doc.addPage();
        doc.setFontSize(16);
        doc.text('Recommended Jobs', 20, 20);

        yOffset = 40;
        recommendedJobs.forEach((job) => {
            doc.text(`Title: ${job.title}`, 20, yOffset);
            doc.text(`Company: ${job.company.displayName}`, 20, yOffset + 10);
            doc.text(`Location: ${job.location.displayName}`, 20, yOffset + 20);
            yOffset += 40;
        });

        doc.save('quiz-results.pdf');
    };

    return (
        <div className="quiz-container">
            <h1>Programming Language Quiz</h1>
            <select className="language-select" onChange={handleLanguageChange}>
                <option value="">Select Programming Language</option>
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>

            {selectedLanguage && questions.length > 0 && !isSubmitted && (
                <div className="question-container">
                    <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
                    <p>{questions[currentQuestionIndex].text}</p>
                    {questions[currentQuestionIndex].options.map((option) => (
                        <div key={option.id} className="option">
                            <input
                                type="radio"
                                name={questions[currentQuestionIndex].id}
                                value={option.id}
                                onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, option.id)}
                            />
                            <label>{option.text}</label>
                        </div>
                    ))}
                    <div className="navigation">
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button onClick={handleNextQuestion}>Next</button>
                        ) : (
                            <button onClick={handleSubmit}>Submit</button>
                        )}
                    </div>
                </div>
            )}

            {isSubmitted && (
                <div className="result-container">
                    <h2>Results</h2>
                    <p>Your score: {score} out of {questions.length}</p>

                    <h3>Recommended Jobs</h3>
                    <div className="job-cards-container">
                        {recommendedJobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <h4>{job.title}</h4>
                                <p><strong>Company:</strong> {job.company.displayName}</p>
                                <p><strong>Location:</strong> {job.location.displayName}</p>
                                <a href={job.redirectUrl} target="_blank" rel="noopener noreferrer">View Job</a>
                            </div>
                        ))}
                    </div>

                    <h3>Correct Answers</h3>
                    <ul>
                        {correctAnswers.map((answer) => {
                            const userAnswer = answers[answer.questionId];
                            if (userAnswer !== answer.correctOptionId) {
                                const question = questions.find((q) => q.id === answer.questionId);
                                const correctOption = question.options.find((o) => o.id === answer.correctOptionId);
                                return (
                                    <li key={answer.questionId}>
                                        <strong>Question:</strong> {question.text}<br />
                                        <strong>Your Answer:</strong> {question.options.find((o) => o.id === userAnswer)?.text || 'None'}<br />
                                        <strong>Correct Answer:</strong> {correctOption?.text || 'None'}
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>

                    <button className="pdf-button" onClick={generatePDF}>Download Results as PDF</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
