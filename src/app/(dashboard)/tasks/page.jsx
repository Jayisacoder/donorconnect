'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, CheckCircle2, Circle, AlertCircle, Clock, Trash2, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const priorityColors = {
  LOW: 'bg-gray-200 text-gray-800 border-gray-500',
  MEDIUM: 'bg-blue-200 text-blue-800 border-blue-500',
  HIGH: 'bg-orange-200 text-orange-800 border-orange-500',
  URGENT: 'bg-red-200 text-red-800 border-red-500',
}

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  DONE: CheckCircle2,
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTaskStatus(taskId, currentStatus) {
    try {
      const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED'
      console.log('Toggling task status:', { taskId, currentStatus, newStatus })
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      console.log('Response status:', res.status)
      if (res.ok) {
        const data = await res.json()
        console.log('Task updated:', data)
        fetchTasks()
      } else {
        const error = await res.json()
        console.error('Failed to update task:', error)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  async function updateTaskPriority(taskId, priority) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'ALL') return true
    if (filter === 'ACTIVE') return task.status !== 'COMPLETED'
    if (filter === 'COMPLETED') return task.status === 'COMPLETED'
    return true
  })

  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED')
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED')
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'COMPLETED' || !t.dueDate) return false
    return new Date(t.dueDate) < new Date()
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Tasks & Reminders
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Stay on top of follow-ups and stewardship actions.</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{activeTasks.length}</div>
            <p className="text-xs text-gray-500 mt-1">Tasks to complete</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{overdueTasks.length}</div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{completedTasks.length}</div>
            <p className="text-xs text-gray-500 mt-1">Done this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Tasks</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === 'ALL' ? 'default' : 'outline'}
                onClick={() => setFilter('ALL')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === 'ACTIVE' ? 'default' : 'outline'}
                onClick={() => setFilter('ACTIVE')}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={filter === 'COMPLETED' ? 'default' : 'outline'}
                onClick={() => setFilter('COMPLETED')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Create your first task to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const StatusIcon = statusIcons[task.status] || Circle
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'

                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-all duration-200 group"
                  >
                    <Checkbox
                      checked={task.status === 'COMPLETED'}
                      onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className={`font-medium ${
                            task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </h3>
                        <select
                          value={task.priority}
                          onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border-2 font-medium cursor-pointer hover:shadow-sm transition-shadow ${priorityColors[task.priority]}`}
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                          <option value="URGENT">URGENT</option>
                        </select>
                        {isOverdue && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.donor && (
                          <Link
                            href={`/donors/${task.donor.id}`}
                            className="hover:text-primary hover:underline"
                          >
                            {task.donor.firstName} {task.donor.lastName}
                          </Link>
                        )}
                        {task.dueDate && (
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.assignedUser && (
                          <span>
                            Assigned to: {task.assignedUser.firstName} {task.assignedUser.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={`h-5 w-5 ${
                          task.status === 'COMPLETED'
                            ? 'text-green-600'
                            : task.status === 'IN_PROGRESS'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                        }`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="opacity-60 group-hover:opacity-100 transition-all text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}