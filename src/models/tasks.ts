export type Task = {
    id?: number,
    title: string,
    description: string,
    due?: bigint | null,
    priority: 'low' | 'medium' | 'high',
    status: 'to do' | 'in progress' | 'completed',
    status_raw: String
}