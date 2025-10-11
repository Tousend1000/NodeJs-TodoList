import { Request, Response, Router } from "express";
import { Task } from "../models/tasks";
import { getTasks } from "../services/dbService";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const tasks: Task[] = await getTasks();

    res.render('index', {tasks: tasks});
});

export {router};