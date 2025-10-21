import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceInManYen(price: number | undefined): string {
  if (price === undefined || price === null) {
    return "-"
  }
  return `${price.toLocaleString()}万円`
}

export function parseManYenToNumber(manYenString: string): number | undefined {
  if (!manYenString) {
    return undefined
  }
  const cleanedString = manYenString.replace(/[^0-9]/g, "")
  const numberValue = parseInt(cleanedString, 10)
  return isNaN(numberValue) ? undefined : numberValue
}
