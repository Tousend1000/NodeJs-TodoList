import { Pool } from 'pg';

import { Task } from '../models/tasks';

const taskCache: Map<number, Task> = new Map();

export const pool = new Pool({
    user: 'appuser',
    host: 'localhost',
    database: 'appdb',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export async function initDb(): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                due BIGINT,
                priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
                status TEXT NOT NULL CHECK (status IN ('to do', 'in progress', 'completed')),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
    } catch (err) {
        console.error("Database initialization failed:", err);
        throw err;
    }

    // Set up cache

    const results = (await pool.query(`SELECT id, title, description, due, priority, status FROM tasks;`)).rows;

    const tasks: Required<Task>[] = [];
    for (let i = 0; i < results.length; i++) {
        const rawTask = results[i];
        const task: Required<Task> = {
            id: Number(rawTask.id),
            title: rawTask.title,
            description: rawTask.description,
            due: rawTask.due || null,
            priority: rawTask.priority,
            status: rawTask.status,
            status_raw: (rawTask.status as String).replace(' ', '')
        };

        if (task) {
            tasks.push(task); 
        }
    }

    tasks.forEach((task) => {
        taskCache.set(task.id, task);
    });
}

export async function getTasks(): Promise<Task[]> {
    const tasks: Task[] = [];
    
    for (const task of taskCache.values()) {
        tasks.push(task);
    }
    
    return tasks;
}

async function getTaskFromDatabase(taskId: number): Promise<Task> {
    const results = (await pool.query(`SELECT id, title, description, due, priority, status FROM tasks WHERE id = $1`, [taskId])).rows;

    if (results.length === 0) {
        throw new Error(`No task with id ${taskId} found.`);
    }

    const rawTask = results[0];
    const task: Required<Task> = {
        id: rawTask.id,
        title: rawTask.title,
        description: rawTask.description,
        due: rawTask.due || null,
        priority: rawTask.priority,
        status: rawTask.status,
        status_raw: (rawTask.status as String).replace(' ', '')
    };

    return task;
}

export async function getTaskById(taskId: number): Promise<Task> {
    if (!taskCache.has(taskId) || !taskCache.get(taskId)) {
        throw new Error(`Failed to get task with id ${taskId}.`)
    }
    return taskCache.get(taskId)!;
}

export async function addTask(task: Task): Promise<number> {
    const result = await pool.query(
        `INSERT INTO tasks (title, description, due, priority, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`, 
        [
            task.title,
            task.description,
            task.due || null,
            task.priority,
            task.status
        ]
    );

    const taskId = result.rows[0].id;

    const newTask: Task = await getTaskFromDatabase(taskId);
    taskCache.set(taskId, newTask)

    return taskId;
}

export async function updateTask(taskId: number, task: Task): Promise<void> {
    await pool.query(
        `UPDATE tasks
        SET title = $2, description = $3, due = $4, priority = $5, status = $6, updated_at = $7
        WHERE id = $1`,
        [
            taskId,

            task.title,
            task.description,
            task.due || null,
            task.priority,
            task.status,
            new Date()
        ]
    );

    const newTask: Task = await getTaskFromDatabase(taskId);
    taskCache.set(taskId, newTask)
}

export async function removeTask(taskId: number): Promise<void> {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);

    taskCache.delete(taskId)
}