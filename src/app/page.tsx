import { AccountsTable } from '@/components/AccountsTable'

function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <AccountsTable />
    </div>
  )
}

export default function App() {
  return <HomePage />
}
