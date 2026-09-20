// src/lib/api/types/api.types.ts

export type ApiSuccess<T> = {
    success: true
    message: string
    data: T
}

export type ApiFieldErrors = Record<string, string[]>

export type ApiErrorBody = {
    success: false
    error: {
        message: string
        fields?: ApiFieldErrors
    }
}

// Pagination

export type PaginationMeta = {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

export type PaginatedData<T> = {
    items: T[]
    pagination: PaginationMeta
}

export type PaginationQuery = {
    page?: number
    pageSize?: number
    sortBy?: 'startsAt' | 'createdAt' | 'status'
    sortDirection?: 'asc' | 'desc'
    status?: LeaveRequestStatus
}

// ── Domain: leave requests
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected'
