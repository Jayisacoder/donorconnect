// Zod validation schemas for donation operations
import { z } from 'zod'

export const DonationTypeEnum = z.enum(['ONE_TIME', 'RECURRING', 'PLEDGE', 'IN_KIND'])

export const createDonationSchema = z.object({
	donorId: z.string().cuid(),
	campaignId: z.string().cuid().nullable().optional(),
	amount: z.coerce.number().positive('Amount must be greater than zero'),
	date: z.coerce.date(),
	type: DonationTypeEnum.default('ONE_TIME'),
	method: z.string().trim().max(50).nullable().optional(),
	notes: z.string().trim().max(1000).nullable().optional(),
})

export const updateDonationSchema = createDonationSchema.partial()

export const donationListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	donorId: z.string().optional(),
	campaignId: z.string().optional(),
	type: DonationTypeEnum.optional(),
	minAmount: z.coerce.number().min(0).optional(),
	maxAmount: z.coerce.number().min(0).optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	sortBy: z.enum(['date', 'amount', 'type', 'createdAt']).default('date'),
	sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
