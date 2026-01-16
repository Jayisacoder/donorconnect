// Zod validation schemas for workflow operations
import { z } from 'zod'

export const WorkflowTriggerEnum = z.enum([
	'FIRST_DONATION',
	'DONATION_RECEIVED',
	'INACTIVITY_THRESHOLD',
	'SEGMENT_ENTRY',
	'MANUAL',
	'SCHEDULED',
])

const workflowStepSchema = z.object({
	type: z.enum(['email', 'task', 'segment_add', 'segment_remove']),
	template: z.string().optional(),
	title: z.string().optional(),
	delay: z.coerce.number().min(0).default(0),
	metadata: z.record(z.any()).optional(),
})

export const createWorkflowSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(150),
	description: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
	segmentId: z.string().cuid().nullable().optional(),
	trigger: WorkflowTriggerEnum,
	steps: z.array(workflowStepSchema).min(1, 'At least one step is required'),
	isActive: z.boolean().default(false),
})

export const updateWorkflowSchema = createWorkflowSchema.partial()

export const workflowListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	search: z.string().trim().optional(),
	isActive: z.coerce.boolean().optional(),
	trigger: WorkflowTriggerEnum.optional(),
	sortBy: z.enum(['name', 'createdAt', 'trigger', 'isActive']).default('name'),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})