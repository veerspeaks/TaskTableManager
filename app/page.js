import TaskTableNew from './components/TaskTableNew';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Task List Manager</h1>
      <TaskTableNew />
    </main>
  )
}