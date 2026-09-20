// src/(features)/authentication/ui/components/forms/schemas/auth-field.schemas.ts

import { z } from 'zod'

/** Maximum number of characters allowed for an email address. */
const EMAIL_MAX = 255

/** Minimum number of characters required for a password. */
const PASSWORD_MIN = 8

/** Maximum number of characters allowed for a password. */
const PASSWORD_MAX = 75

/** Minimum number of characters required for a user's name. */
const NAME_MIN = 2

/** Maximum number of characters allowed for a user's name. */
const NAME_MAX = 100

/** Centralized validation messages used by the authentication */
const MESSAGES = {
    email: {
        required: 'Enter a valid email address.',
        max: `The email cannot exceed ${EMAIL_MAX} characters.`,
    },
    password: {
        required: 'Enter a password.',
        min: `Password must be at least ${PASSWORD_MIN} characters.`,
        max: `The password cannot exceed ${PASSWORD_MAX} characters.`,
        uppercase: 'Password must contain at least one uppercase letter.',
    },
    name: {
        required: 'Enter your name.',
        min: `Name must be at least ${NAME_MIN} characters.`,
        max: `The name cannot exceed ${NAME_MAX} characters.`,
    },
} as const

/**
 * Checks whether a string contains ASCII control characters.
 *
 * ASCII control characters are non-printable characters in the ranges
 * 0x00-0x1F and 0x7F. These characters should not normally appear in
 * user-entered authentication or profile fields.
 *
 * Examples include null characters, line breaks, tabs, and other
 * non-printable control characters.
 *
 * The check is performed manually instead of using a regular expression
 * to keep the validation logic explicit and easy to understand.
 *
 * @param value The string to validate.
 * @returns `true` when a control character is present; otherwise `false`.
 */
function containsAsciiControlChars(value: string): boolean {
    for (let index = 0; index < value.length; index++) {
        const code = value.charCodeAt(index)
        if (code <= 0x1f || code === 0x7f) {
            return true
        }
    }
    return false
}

const noControlChars = (message: string) => ({
    refine: (value: string) => !containsAsciiControlChars(value),
    message,
})

export const PASSWORD_RULES = [
    { id: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
    {
        id: 'uppercase',
        label: 'Contains an uppercase letter',
        test: (v: string) => /[A-Z]/.test(v),
    },
    { id: 'number', label: 'Contains a number', test: (v: string) => /\d/.test(v) },
    {
        id: 'special',
        label: 'Contains a special character',
        test: (v: string) => /[!@#$%^&*]/.test(v),
    },
] as const

/** Strength = satisfied rules (0–4). */
export function passwordStrength(value: string): number {
    return PASSWORD_RULES.filter((rule) => rule.test(value)).length
}

/**
 * Validates user email addresses.
 *
 * The schemas trims surrounding whitespace, enforces the configured
 * length limit, validates the email format, and rejects ASCII control
 * characters that should not be accepted as part of an email address.
 */
export const emailSchema = z
    .string()
    .trim()
    .min(1, { message: MESSAGES.email.required })
    .max(EMAIL_MAX, { message: MESSAGES.email.max })
    .email({ message: MESSAGES.email.required })
    .refine(noControlChars(MESSAGES.email.required).refine, {
        message: noControlChars(MESSAGES.email.required).message,
    })

/**
 * Validates user passwords.
 *
 * Passwords must satisfy the configured minimum and maximum length
 * requirements and must not contain ASCII control characters.
 *
 * Unlike the email and name schemas, the password is not trimmed,
 * since whitespace can technically be part of a password and should
 * not be silently modified during validation.
 */
export const passwordSchema = z
    .string()
    .max(PASSWORD_MAX, { message: MESSAGES.password.max })
    .superRefine((value, ctx) => {
        for (const rule of PASSWORD_RULES) {
            if (!rule.test(value)) {
                ctx.addIssue({ code: 'custom', message: rule.label })
            }
        }
    })
    .refine((value) => !containsAsciiControlChars(value), {
        message: MESSAGES.password.required,
    })

/**
 * Validates a user's name.
 *
 * The schemas removes surrounding whitespace, requires the name to
 * contain at least the configured minimum number of characters,
 * enforces the maximum length, and rejects ASCII control characters.
 */
export const nameSchema = z
    .string()
    .trim()
    .min(NAME_MIN, { message: MESSAGES.name.min })
    .max(NAME_MAX, { message: MESSAGES.name.max })
    .refine(noControlChars(MESSAGES.name.required).refine, {
        message: noControlChars(MESSAGES.name.required).message,
    })
