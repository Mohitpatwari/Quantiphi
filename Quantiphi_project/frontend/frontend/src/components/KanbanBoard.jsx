import { useState, useEffect } from 'react';

// CSS for the pulsing red Vibe Check
const pulseAnimation = `
  @keyframes pulse-red {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  .burnout-warning {
    animation: pulse-red 2s infinite;
    background-color: #ef4444 !important;
  }
`;

export default function KanbanBoard({ projectId, teamMembers }) {
    const [boardData, setBoardData] = useState(null);

    useEffect(() => {
        fetch(`/api/projects/${projectId}/kanban`)
            .then(res => res.json())
            .then(data => setBoardData(data));
    }, [projectId]);

    if (!boardData) return <div>Loading...</div>;

    const { tasks, columnCounts, vibeCheck } = boardData;

    return (
        <div>
            <style>{pulseAnimation}</style>
            
            {/* Team List with Vibe Check Avatar[cite: 1] */}
            <div className="flex gap-4 mb-8">
                {teamMembers.map(user => (
                    <div 
                        key={user.id} 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gray-500 
                        ${vibeCheck[user.id] ? 'burnout-warning' : ''}`}
                    >
                        {user.name.charAt(0)}
                    </div>
                ))}
            </div>

            {/* Kanban Columns[cite: 1] */}
            <div className="flex gap-6">
                {['To-Do', 'In Progress', 'Done'].map(column => (
                    <div key={column} className="w-1/3 bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-bold mb-4">
                            {column} 
                            <span className="ml-2 text-sm bg-gray-300 px-2 rounded-full">
                                {columnCounts[column]} {/* Column counter[cite: 1] */}
                            </span>
                        </h3>
                        {/* Drag and Drop implementation goes here */}
                        {tasks.filter(t => t.status === column).map(task => (
                            <div key={task.id} className="bg-white p-3 mb-2 rounded shadow">
                                <h4 className="font-semibold">{task.title}</h4>
                                <span className="text-xs text-red-500">{task.priority}</span> {/* Priority tags[cite: 1] */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}