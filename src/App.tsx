import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>){
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>){
    event.preventDefault();
    console.log("something in the drop zone")
    setCount(count + 1)
    const csv = event.dataTransfer.files
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Find Duplicates</h1>
      <div className="card">
        <button onClick={handleClick}>count is {count}</button>
        <div onDragOver={handleDragOver} onDrop={handleDrop} className="drop-zone">
          <p>
            Drag your csv file into this drop zone<i>drop zone</i>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
