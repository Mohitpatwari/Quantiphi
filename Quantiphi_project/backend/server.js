const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db'); 

app.use(express.json());
app.use(cors());

app.get('/api/projects/:projectId/kanban', async (req, res) => {
    const { projectId } = req.params;
    
    try {
        const tasksQuery = await db.query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
        const tasks = tasksQuery.rows;

        const columnCounts = {
            'To-Do': tasks.filter(t => t.status === 'To-Do').length,
            'In Progress': tasks.filter(t => t.status === 'In Progress').length,
            'Done': tasks.filter(t => t.status === 'Done').length
        };

        const userWorkloadQuery = await db.query(`
            SELECT assignee_id, COUNT(*) as in_progress_count 
            FROM tasks 
            WHERE project_id = $1 AND status = 'In Progress' AND assignee_id IS NOT NULL
            GROUP BY assignee_id
        `, [projectId]);
        
        const vibeCheck = {};
        userWorkloadQuery.rows.forEach(row => {
            vibeCheck[row.assignee_id] = row.in_progress_count > 5;
        });

        res.json({ tasks, columnCounts, vibeCheck });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/tasks/:taskId/status', async (req, res) => {
    const { status } = req.body;
    await db.query('UPDATE tasks SET status = $1 WHERE id = $2', [status, req.params.taskId]);
    res.json({ message: 'Task updated successfully' });
});

app.post('/api/chatbot', async (req, res) => {
    const { message } = req.body;
    
    // Feature 1: Natural Language Task Creation
    if (message.toLowerCase().includes('assign') && message.toLowerCase().includes('task')) {
        const title = "Generated Task from Chatbot";
        // Mock inserting a task for a user (assumes project_id 1, user_id 2 exists)
        await db.query(
            `INSERT INTO tasks (project_id, assignee_id, title, status, priority) VALUES (1, 2, $1, 'To-Do', 'High')`, 
            [title]
        );
        return res.json({ reply: 'Task successfully parsed and created in the To-Do column!' });
    }

    // Feature 2: Automated Blocker Resolution
    if (message.toLowerCase().includes('blocker')) {
        return res.json({ reply: 'Bot: I noticed a task is stalled in "In Progress". Are you facing any blockers? Reply here and I will add it as a comment to the task.' });
    }

    res.json({ reply: 'I am your AI assistant. Try saying "Assign a task" or "Check blockers".' });
});

app.listen(5000, () => console.log('Server running on port 5000'));