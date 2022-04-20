import React, { useState, useEffect } from 'react';
import './App.css';

var count = 0;

function App() {
  const [ facts, setFacts ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    console.log(++count);
    console.log(listening);
    if (!listening) {
      const events = new EventSource('http://localhost:3000/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);

        setFacts(facts.concat(parsedData));
        console.log(facts);
      };

      setListening(true);
    }
    // return () => { console.log(events); if (events) events.close(); } ;
  }, [listening, facts]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {
          facts.map((fact, i) =>
            <tr key={i}>
              <td>{fact.info}</td>
              <td>{fact.source}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default App;
