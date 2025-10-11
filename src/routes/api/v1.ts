import express, { Request, Response, Router } from "express";
import { Task } from "../../models/tasks";
import { getTasks, removeTask, getTaskById, updateTask, addTask } from "../../services/dbService";
import { createRateLimiter, editRateLimiter } from "../../middleware/rateLmiters";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const tasks: Task[] = await getTasks();

    res.json({ success: true, data: tasks });
});

router.post('/', createRateLimiter, async (req: Request, res: Response) => {
    const data: object = req.body;

    if (!['title', 'description', 'priority'].every(key => key in data)) {
        res.status(400).json({ 'success': false, 'error': 'Missing data.' });
        return;
    }

    const taskData: Task = data as Task;

    if (!['low', 'medium', 'high'].includes(taskData.priority)) {
        res.status(400).json({ 'success': false, 'error': 'Invalid priority.' });
        return;
    }

    const task: Task = {
        title: taskData.title,
        description: taskData.description,
        due: taskData.due || null,
        priority: taskData.priority,
        status: 'to do',
        status_raw: 'todo'
    };

    const taskId = await addTask(task);

    res.json({ success: true, taskId: taskId });
});

router.put('/:taskId', editRateLimiter, async (req: Request, res: Response) => {
    const data: object = req.body;
    const taskId: number = Number(req.params.taskId);

    if (!taskId) {
        res.status(400).json({ 'success': false, 'error': 'Invalid task id.' });
        return
    }

    if (['title', 'description', 'due', 'priority', 'status'].every((item) => item in data)) {
        res.status(400).json({ 'success': false, 'error': 'You must specify data to change.' });
        return
    }

    const taskData: Task = data as Task;

    if ('priority' in data) {
        if (!['low', 'medium', 'high'].includes(taskData.priority)) {
            res.status(400).json({ 'success': false, 'error': 'Invalid priority.' });
            return;
        }
    }

    if ('status' in data) {
        if (!['to do', 'in progress', 'completed'].includes(taskData.status)) {
            res.status(400).json({ 'success': false, 'error': 'Invalid status.' });
            return;
        }
    }

    let oldTask: Task;
    try {
        oldTask = await getTaskById(taskId);
    } catch (err) {
        res.status(400).json({ 'success': false, 'error': 'Task with the given id not found.' })
        return
    }

    const task: Task = {
        title: taskData.title || oldTask.title,
        description: taskData.description || oldTask.description,
        due: taskData.due || oldTask.due,
        priority: taskData.priority || oldTask.priority,
        status: taskData.status || oldTask.status,
        status_raw: (taskData.status as String).replace(' ', '') || oldTask.status_raw
    };

    await updateTask(taskId, task);

    res.json({ 'success': true, 'message': 'Successfully updated task.' });
});

router.delete('/:taskId', createRateLimiter, async (req: Request, res: Response) => {
    const taskId: number = Number(req.params.taskId);

    if (!taskId) {
        res.status(400).json({ 'success': false, 'message': 'Invalid task id.' });
    }

    await removeTask(taskId);

    res.json({ 'success': true, 'message': 'Successfully deleted task.' });
});

export {router};