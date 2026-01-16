// Zod validation schemas for campaign operations
import { z } from 'zod'

export const CampaignStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'])

export const createCampaignSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(100),
	description: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
	goalAmount: z.coerce.number().positive().optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	status: CampaignStatusEnum.default('DRAFT'),
})

export const updateCampaignSchema = createCampaignSchema.partial()

export const campaignListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	search: z.string().trim().optional(),
	status: CampaignStatusEnum.optional(),
	sortBy: z.enum(['name', 'startDate', 'endDate', 'status', 'goalAmount']).default('name'),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})