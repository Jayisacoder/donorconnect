"use client"

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WorkflowBuilderForm } from '@/components/workflows/workflow-builder-form'
import { Play, Pause, Mail, Clock, CheckSquare, ArrowRight } from 'lucide-react'

const STEP_ICONS = {
  email: Mail,
  task: CheckSquare,
  wait: Clock,
}

export default function WorkflowDetailPage({ params }) {
  const { id: workflowId } = use(params)
  const [workflow, setWorkflow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState(false)

  const loadWorkflow = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/workflows/${workflowId}`)
      if (!res.ok) throw new Error('Failed to load workflow')
      const data = await res.json()
      setWorkflow(data.workflow || null)
    } catch (err) {
      setError('Unable to load workflow')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkflow()
  }, [workflowId])

  const toggleActive = async () => {
    setToggling(true)
    try {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !workflow.isActive }),
      })
      if (res.ok) {
        await loadWorkflow()
      } else {
        alert('Failed to toggle workflow')
      }
    } catch (error) {
      console.error('Error toggling workflow:', error)
      alert('Failed to toggle workflow')
    } finally {
      setToggling(false)
    }
  }

  if (loading) return <div>Loading workflow...</div>
  if (error || !workflow) return <div>{error || 'Workflow not found.'}</div>

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{workflow.name}</h1>
            <Badge className={workflow.isActive ? 'bg-green-600' : 'bg-gray-600'}>
              {workflow.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{workflow.description || 'No description provided.'}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={workflow.isActive ? 'outline' : 'default'} 
            onClick={toggleActive} 
            disabled={toggling}
            className="gap-2"
          >
            {workflow.isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Link href="/workflows">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Trigger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{workflow.trigger.replace(/_/g, ' ')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{workflow.steps?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{workflow.executionCount || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Steps Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
        </CardHeader>
        <CardContent>
          {workflow.steps && workflow.steps.length > 0 ? (
            <div className="space-y-3">
              {workflow.steps.map((step, index) => {
                const StepIcon = STEP_ICONS[step.type] || CheckSquare
                return (
                  <div key={`${index}-${step.type}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className="rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        {index < workflow.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 rotate-90 my-1" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StepIcon className="h-4 w-4 text-gray-600" />
                          <Badge variant="outline" className="font-medium">
                            {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                          </Badge>
                        </div>
                        
                        {step.type === 'email' && (
                          <div className="text-sm space-y-1">
                            {step.subject && <p><span className="font-medium">Subject:</span> {step.subject}</p>}
                            {step.body && <p className="text-gray-600">{step.body.substring(0, 100)}{step.body.length > 100 ? '...' : ''}</p>}
                            {step.template && <p className="text-xs text-gray-500">Template: {step.template}</p>}
                          </div>
                        )}
                        
                        {step.type === 'task' && (
                          <div className="text-sm space-y-1">
                            {step.title && <p><span className="font-medium">Task:</span> {step.title}</p>}
                            {step.description && <p className="text-gray-600">{step.description}</p>}
                            {step.assignTo && <p className="text-xs text-gray-500">Assign to: {step.assignTo}</p>}
                          </div>
                        )}
                        
                        {step.type === 'wait' && (
                          <p className="text-sm">
                            Wait for <span className="font-medium">{step.days} day{step.days !== 1 ? 's' : ''}</span>
                          </p>
                        )}
                      </div>
                    </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No steps defined</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowBuilderForm
            workflow={workflow}
            onSubmit={async (data) => {
              const res = await fetch(`/api/workflows/${workflowId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })
              if (res.ok) {
                await loadWorkflow()
              } else {
                alert('Failed to update workflow')
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
