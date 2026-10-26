
import KanbanBoard from './components/KanbanBoard'; // Ensure this matches your file name exactly
import ChatbotWidget from './components/ChatWidget'; // Ensure this matches your file name exactly

function App() {
  const mockTeam = [
    { id: 1, name: 'Aditi' },
    { id: 2, name: 'Rahul' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-2xl font-bold p-8 pb-0">Task Manager</h1>
      <KanbanBoard projectId={1} teamMembers={mockTeam} />
      <ChatbotWidget />
    </div>
  );
}

export default App;