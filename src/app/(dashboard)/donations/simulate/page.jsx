import { TransactionSimulator } from '@/components/donations/transaction-simulator'

export default function SimulatePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction Simulation</h1>
        <p className="text-gray-600 mt-2">
          Use this tool to simulate incoming donations and test your workflows and dashboard updates.
        </p>
      </div>
      
      <TransactionSimulator />
    </div>
  )
}
