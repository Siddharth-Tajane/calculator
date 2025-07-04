import React, { useState, useEffect } from 'react';
import { evaluate, sqrt, sin, cos, tan, log, pi, factorial } from 'mathjs';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('light');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showScientific, setShowScientific] = useState(false);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleHistory = () => setShowHistory((prev) => !prev);
  const toggleScientific = () => setShowScientific((prev) => !prev);

  const basicButtons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', '🔁'],
  ];

  const scientificButtons = [
    ['(', ')', '√', '^'],
    ['sin', 'cos', 'tan', 'log'],
    ['π', '!', '/', '*'],
    ['0', '.', '=', '+'],
    ['C', '🔁'],
  ];

  const handleClick = (value) => {
    if (value === 'C') {
      setInput('');
      return;
    }
    if (value === '🔁') {
      toggleScientific();
      return;
    }
    if (value === '=') {
      try {
        const preparedInput = input
          .replace(/π/g, pi)
          .replace(/√/g, 'sqrt')
          .replace(/!/g, 'factorial')
          .replace(/sin|cos|tan|log/g, (fn) => fn);

        const result = evaluate(preparedInput);
        setInput(result.toString());
        setHistory((prev) => [...prev, `${input} = ${result}`]);
      } catch (error) {
        setInput('Error');
      }
      return;
    }

    if (value === 'π') {
      setInput((prev) => prev + 'π');
    } else if (value === '√') {
      setInput((prev) => prev + '√(');
    } else if (value === '!') {
      setInput((prev) => prev + '!');
    } else if (['sin', 'cos', 'tan', 'log'].includes(value)) {
      setInput((prev) => prev + `${value}(`);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleHistoryClick = (item) => {
    const expression = item.split('=')[0].trim();
    setInput(expression);
  };

  useEffect(() => {
    const flashButton = (key) => {
      const button = document.querySelector(`.key-${CSS.escape(key)}`);
      if (button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 150);
      }
    };

    const handleKeyDown = (e) => {
      const key = e.key;
      if (key === 'Enter') return handleClick('=');
      if (key === 'Escape' || key === 'Backspace') return handleClick('C');
      if (/^[0-9+\-*/.=()]$/.test(key)) return handleClick(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  const buttonsToRender = showScientific ? scientificButtons : basicButtons;

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div
              className={`card p-3 shadow rounded-4 position-relative overflow-hidden ${
                theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'
              }`}
              style={{ height: '460px' }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Calculator</h5>
                <div className="d-flex gap-2">
                  <span
                    role="button"
                    title="Toggle Theme"
                    onClick={toggleTheme}
                    style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </span>
                  <span
                    role="button"
                    title="Toggle History"
                    onClick={toggleHistory}
                    style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                  >
                    🧾
                  </span>
                </div>
              </div>

              {/* History Panel */}
              {showHistory && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 border rounded-4 p-3"
                  style={{
                    zIndex: 10,
                    overflowY: 'auto',
                    backgroundColor: theme === 'dark' ? '#495057' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 text-muted">History</h6>
                    <span
                      role="button"
                      title="Close History"
                      onClick={toggleHistory}
                      style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                    >
                      ✖
                    </span>
                  </div>
                  {history.length === 0 ? (
                    <p className="text-muted small">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((item, idx) => (
                      <div
                        key={idx}
                        className="history-item small text-break py-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleHistoryClick(item)}
                      >
                        {item}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Input Display */}
              <input
                type="text"
                className="form-control mb-3 text-end"
                value={input}
                readOnly
              />

              {/* Buttons Grid */}
              <div className="row g-2">
                {buttonsToRender.flat().map((btn, idx) => (
                  <div key={idx} className={`col-${btn === 'C' || btn === '🔁' ? '6' : '3'}`}>
                    <button
                      className={`btn w-100 py-2 key-${btn} ${
                        theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'
                      }`}
                      onClick={() => handleClick(btn)}
                    >
                      {btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer py-2 bg-light text-center border-top">
        <div className="container d-flex flex-column align-items-center">
          <div className="footer-content text-muted small text-center mb-1">
           <b> &copy; 2025 Phone Contact App. All rights reserved by Siddharth.</b>
          </div>
          <a
            href="tel:+7219676792"
            className="text-decoration-none text-muted contact-link"
            title="Call Siddharth"
          >
            📞<b> Call Developer</b>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
