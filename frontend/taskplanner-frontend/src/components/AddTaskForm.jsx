import { useState, useEffect } from "react";

const AddTaskForm = ({ onTaskAdded, token }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [priority, setPriority] = useState("1");
    const [taskClass, setTaskClass] = useState("");
    const [taskClasses, setTaskClasses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTaskClasses();
    }, []);

    const fetchTaskClasses = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/task_classes/", {
                headers: { "Authorization": `Token ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setTaskClasses(data);
            } else {
                throw new Error("Tehtäväluokkien lataus epäonnistui.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Tehtävän nimi ei voi olla tyhjä.");
            return;
        }

        const newTask = {
            title,
            description,
            completed,
            priority,
            task_class: taskClass,
        };

        try {
            const response = await fetch("http://localhost:8000/api/tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`, // Tarvitaan autentikaatio
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
            setTaskClass("");
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
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Prioriteetti:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <label>Tehtäväluokka:</label>
                    <select value={taskClass} onChange={(e) => setTaskClass(e.target.value)}>
                        <option value="">Valitse luokka</option>
                        {taskClasses.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.title}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Lisää tehtävä</button>
            </form>
        </div>
    );
};

export default AddTaskForm;