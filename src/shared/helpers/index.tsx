import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString()
