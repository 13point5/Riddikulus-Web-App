import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");

  return (
    <div>
      <div>
        <label htmlFor="question">Question</label>
        <textarea id="question" name="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </div>
      <button type="button">Thematify the question!</button>
    </div>
  );
}

export default App;
