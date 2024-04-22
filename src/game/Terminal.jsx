import React, { useState, useEffect } from 'react';

const shapes = {
  square: `
#####
#   #
#   #
#   #
#####`,
  circle: ` 
  ###
 #   #
#     #
 #   #
  ###`,
  triangle: `
   #
 #   #
#     #
#######`
};

const colors = ['text-red-500', 'text-green-500', 'text-yellow-500', 'text-orange-500', 'text-blue-500', 'text-purple-500'];

function getRandomShapes() {
  const keys = Object.keys(shapes);
  const color = colors[Math.floor(Math.random() * colors.length)];
  return [
    { shape: shapes[keys[Math.floor(Math.random() * keys.length)]], color: color },
    { shape: shapes[keys[Math.floor(Math.random() * keys.length)]], color: color }
  ];
}

const Game = () => {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [sequences, setSequences] = useState([]);

  useEffect(() => {
    const newSequences = [];
    for (let i = 0; i < 3; i++) { // Limited to 3 sequences
      newSequences.push(getRandomShapes());
    }
    setSequences(newSequences);
  }, []);

  useEffect(() => {
    if (currentSequence < 3 - 1 && sequences.length > 0 && !showTest) {
      const timer = setTimeout(() => {
        setCurrentSequence(currentSequence + 1);
      }, 3000); // Adjust time as needed
      return () => clearTimeout(timer);
    } else if (currentSequence === 3 - 1) {
      setShowTest(true);
    }
  }, [currentSequence, sequences, showTest]);

  const handleAnswerChange = (event, index) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      const correct = sequences[index].map(item => Object.keys(shapes).find(key => shapes[key] === item.shape));
      if (answer.trim() === correct.join(' ')) {
        score++;
      }
    });
    return score;
  };

  const renderSequence = (sequence, seqIndex) => (
    <div>
      <h3 className="text-lg mb-1">{`Sequence ${seqIndex + 1}`}</h3>
      <div className="flex justify-center space-x-2">
        {sequence.map((item, index) => (
          <pre key={index} className={`${item.color} text-sm`}>{item.shape}</pre>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App p-5">
      {!showTest && sequences.length > 0 && (
        <div className="text-center">
          {renderSequence(sequences[currentSequence], currentSequence)}
        </div>
      )}

      {showTest && (
        <div className="test-section">
          <h2 className="text-lg">Memory Test</h2>
          {sequences.map((sequence, index) => (
            <div key={index}>
              <label className="block mb-2">What was the shape pair in sequence {index + 1}?</label>
              <input
                type="text"
                className="p-2 border border-gray-300 rounded"
                onChange={(e) => handleAnswerChange(e, index)}
                value={userAnswers[index] || ''}
              />
            </div>
          ))}
          <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={() => alert(`Your score is ${calculateScore()}`)}>Submit Answers</button>
        </div>
      )}
    </div>
  );
}

export default Game;
