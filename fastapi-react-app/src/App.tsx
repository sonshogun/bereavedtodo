import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import IntakeForm from './components/IntakeForm'
import ChecklistView from './components/ChecklistView'

const router = createBrowserRouter([
  { path: '/', element: <IntakeForm /> },
  { path: '/checklist', element: <ChecklistView /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
