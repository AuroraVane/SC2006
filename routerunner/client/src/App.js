import React, {useEffect, useState} from 'react';

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => setBackendData(data)
    );
  }, []);

  return (
    <div className="App">
      <h1>Welcome to My React App!</h1>
      {/* Add your components and content here */}
    </div>
  );
}

export default App;