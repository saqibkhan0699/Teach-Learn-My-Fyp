// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './notes.css';
// import NoteModal from './noteModal.jsx';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

// const NotesComponent = () => {
//   const [notes, setNotes] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [selectedLanguage, setSelectedLanguage] = useState(null);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const notesPerPage = 10;

//   useEffect(() => {
//     fetchNotes();
//     fetchLanguages();
//   }, [selectedLanguage]);

//   const fetchNotes = async () => {
//     try {
//       const response = await axios.get(
//         'https://localhost:7190/api/Notes/GetLearningNotes' +
//           (selectedLanguage ? `?programmingLanguageId=${selectedLanguage}` : '')
//       );
//       setNotes(response.data);
//       setCurrentPage(1); // Reset to first page on data fetch
//     } catch (error) {
//       console.error('Error fetching notes:', error);
//     }
//   };

//   const fetchLanguages = async () => {
//     try {
//       const response = await axios.get('https://localhost:7190/api/Notes/ProgrammingLanguageDropDown');
//       setLanguages(response.data);
//     } catch (error) {
//       console.error('Error fetching languages:', error);
//     }
//   };

//   const handleLanguageChange = (event) => {
//     const selectedId = parseInt(event.target.value);
//     setSelectedLanguage(selectedId);
//   };

//   const openModal = (note) => {
//     setSelectedNote(note);
//   };

//   const closeModal = () => {
//     setSelectedNote(null);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(notes.length / notesPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Logic for displaying current notes
//   const indexOfLastNote = currentPage * notesPerPage;
//   const indexOfFirstNote = indexOfLastNote - notesPerPage;
//   const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

//   // Logic for displaying page numbers
//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(notes.length / notesPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div>
//       <div className="headerpage">
//         <h2>Learning Notes</h2>
//       </div>
//       <div className="dropdown-container">
//         <h3>Filter Notes</h3>
//         <select onChange={handleLanguageChange}>
//           <option value="">All Languages</option>
//           {languages.map((language) => (
//             <option key={language.id} value={language.id}>
//               {language.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="table-container">
//         <table className="table-custom">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Subject</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentNotes.map((note, index) => (
//               <tr key={index}>
//                 <td>{note.title.length > 20 ? note.title.substring(0, 20) + '...' : note.title}</td>
//                 <td>{note.subject.length > 20 ? note.subject.substring(0, 20) + '...' : note.subject}</td>
//                 <td className="actions">
//                   <button className="icon-button" onClick={() => openModal(note)}>
//                     <FontAwesomeIcon icon={faEye} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="pagination-container">
//           <ul className="pagination">
//             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePreviousPage}>
//               <FontAwesomeIcon icon={faAngleLeft} />
//             </li>
//             {pageNumbers.map(number => (
//               <li
//                 key={number}
//                 className={`page-item ${number === currentPage ? 'active' : ''}`}
//                 onClick={() => handlePageChange(number)}
//               >
//                 {number}
//               </li>
//             ))}
//             <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`} onClick={handleNextPage}>
//               <FontAwesomeIcon icon={faAngleRight} />
//             </li>
//           </ul>
//         </div>
//       </div>
//       {selectedNote && <NoteModal note={selectedNote} closeModal={closeModal} />}
//     </div>
//   );
// };

// export default NotesComponent;



// import React, { useState } from 'react';
// import axios from 'axios';
// import './notes.css';  // For styling

// function App() {
//   const [textInput, setTextInput] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Function to handle input change
//   const handleInputChange = (event) => {
//     setTextInput(event.target.value);
//   };

//   // Function to handle prompt submission
//   const handlePromptSubmit = async () => {
//     if (textInput.trim() === '') {
//       setError('Please enter some text.');
//       return;
//     }
  
//     setLoading(true);
//     setError('');
//     try {
//       // Make sure to pass the correct query parameter for text
//       const response = await axios.get('https://localhost:7190/api/Notes/Prompt', {
//         params: { text: textInput },
//       });
  
//       // Extract the text from the response
//       const responseText = response.data.candidates[0]?.content?.parts[0]?.text;

//       if (responseText) {
//         console.log('Backend Response:', responseText); // Log response text for debugging
//         setResponse(responseText);  // Update state with the extracted text
//       } else {
//         setError('No response text received.');
//       }
//     } catch (err) {
//       console.error('Error fetching data from backend:', err); // Log the error for debugging
//       setError('Error fetching data from backend. Please try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container">
//       <h1 className="title">Gemini Text Prompt</h1>
//       <div className="input-container">
//         <input
//           type="text"
//           className="input-field"
//           placeholder="Enter text here..."
//           value={textInput}
//           onChange={handleInputChange}  
//         />
//         <button className="submit-button" onClick={handlePromptSubmit} disabled={loading}>
//           {loading ? 'Loading...' : 'Submit'}
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <div className="response-container">
//         <h3>Response:</h3>
//         <div className="response-content">
//           {response ? response : 'The response will appear here.'}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import axios from 'axios';
import './notes.css'; // For styling

function App() {
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = ['C#', 'JavaScript', 'Python', 'Java', 'C++','React','Angular','Node js', '.NET Core','Ruby and Rails', 'C','Tailwand','Express js'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Function to handle prompt submission
  const handlePromptSubmit = async () => {
    if (!language || !level) {
      setError('Please select both a programming language and a learning level.');
      return;
    }

    setLoading(true);
    setError('');
    const customPrompt = `Provide ${level.toLowerCase()} learning notes for ${language}.`;

    try {
      // Make the API call with the custom prompt
      const response = await axios.get('https://localhost:7190/api/Notes/Prompt', {
        params: { userInput: customPrompt },
      });

      // Extract the HTML from the response
      const responseHtml = response.data.contentSections[0]; // Assuming the HTML is in the first section

      if (responseHtml) {
        console.log('Backend Response:', responseHtml); // Log response for debugging
        setResponse(responseHtml); // Update state with the extracted HTML
      } else {
        setError('No response text received.');
      }
    } catch (err) {
      console.error('Error fetching data from backend:', err); // Log the error for debugging
      setError('Error fetching data from backend. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Select a Programming Language and Level</h1>
      
      <div className="dropdown-container">
        <label htmlFor="language">Programming Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">-- Select Language --</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label htmlFor="level">Learning Level:</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">-- Select Level --</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      <div className="button-container">
        <button className="submit-button" onClick={handlePromptSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="response-container">
        <h3>Response:</h3>
        <div 
          className="response-content" 
          dangerouslySetInnerHTML={{ __html: response || 'The response will appear here.' }} 
        />
      </div>
    </div>
  );
}

export default App;
