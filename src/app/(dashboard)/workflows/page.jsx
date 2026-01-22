"use client"

import { useWorkflows } from '@/hooks/use-workflows'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Workflows page
export default function WorkflowsPage() {
  const { workflows, loading } = useWorkflows(1, 50, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-gray-400 mt-2">Automate follow-ups and donor journeys.</p>
        </div>
        <a href="/workflows/new">
          <Button>+ New Workflow</Button>
        </a>
      </div>

      {loading && <div>Loading workflows...</div>}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workflows?.length ? (
            workflows.map((wf) => (
              <a key={wf.id} href={`/workflows/${wf.id}`}>
                <Card className="h-full transition-all duration-200 hover:shadow-xl hover:scale-105 hover:border-primary/30 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{wf.name}</CardTitle>
                      <span className={`text-xs font-medium rounded px-2 py-1 ${
                        wf.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-slate-700 text-gray-200'
                      }`}>
                        {wf.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">{wf.description || 'No description'}</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-300">
                    <p><span className="font-medium">Trigger:</span> {wf.trigger.replace(/_/g, ' ')}</p>
                    <p><span className="font-medium">Steps:</span> {Array.isArray(wf.steps) ? wf.steps.length : 0}</p>
                    <p><span className="font-medium">Executions:</span> {wf.executionCount || 0}</p>
                  </CardContent>
                </Card>
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-300">No workflows found. Click "New Workflow" to create one.</p>
          )}
        </div>
      )}
    </div>
  )
}