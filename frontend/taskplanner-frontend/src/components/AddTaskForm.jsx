import { useState } from "react";
 
const AddTaskForm = ({ onTaskAdded, token }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [completed, setCompleted] = useState(false);
    const [priority, setPriority] = useState("1");

    const [error, setError] = useState(null);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
 
        if (!title.trim()) {
            setError("Tehtävän nimi ei voi olla tyhjä.");
            return;
        }
 
        const newTask = { title, description, completed, priority };
 
        try {
            const response = await fetch("http://localhost:8000/api/tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,  
                },
                body: JSON.stringify(newTask),
            });
 
            if (!response.ok) {
                throw new Error("Tehtävän lisääminen epäonnistui.");
            }
 
            const createdTask = await response.json();
            onTaskAdded(createdTask);
            setTitle("");
            setDescription("");
            setCompleted(false);
            setPriority("1");
        } catch (error) {
            setError(error.message);
        }
    };
 
    return (
        <div>
            <h2>Lisää uusi tehtävä</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tehtävän nimi:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Kuvaus:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Valmis:</label>
                    <input type="checkbox" 
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Prioriteetti:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="1">ALIN ARVO</option>
                        <option value="2">KESKIMMÄINEN ARVO</option>
                        <option value="3">YLIN ARVO</option>
                    </select>
                </div>
                <button type="submit">Lisää tehtävä</button>
            </form>
        </div>
    );
};
 
export default AddTaskForm;