import { useEffect, useState } from "react";
import { getTaskClasses } from "../api/taskApi";
 
const EditTaskForm = ({ task, onTaskUpdated, token }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const [completed, setCompleted] = useState(task.completed);
    const [priority, setPriority] = useState(task.priority);

    const [taskClass, setTaskClass] = useState("");
    const [taskClasses, setTaskClasses] = useState([]);

    const [error, setError] = useState(null);
 
    useEffect(() => {
        async function fetchData() {
          const data = await getTaskClasses(token);
          setTaskClasses(data);
          console.log(data);
          
          setTaskClass(task.task_class);
        }
        fetchData();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
 
        if (!title.trim()) {
            setError("Tehtävän nimi ei voi olla tyhjä.");
            return;
        }
 
        const updatedTask = { title, description, completed, priority, task_class: taskClass };
 
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify(updatedTask),
            });
 
            if (!response.ok) {
                throw new Error("Tehtävän päivittäminen epäonnistui.");
            }
 
            const data = await response.json();
            onTaskUpdated(data);  // Päivittää tilan yläkomponentissa
        } catch (error) {
            setError(error.message);
        }
    };
 
    return (
        <div>
            <h2>Muokkaa tehtävää</h2>
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
                <div>
                    <label>Tehtäväluokka:</label>
                    <select value={taskClass} onChange={(e) => setTaskClass(e.target.value)}>
                        {taskClasses.map((class_item) => (
                            <option key={class_item.id} value={class_item.id}>{class_item.title}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">MUOKKAA</button>
            </form>
        </div>
    );
};
 
export default EditTaskForm;