/**
 * Conditional class name utility
 * Combines classnames with support for conditional rendering
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .reduce((acc: string[], current) => {
      if (typeof current === 'string' && current) {
        acc.push(current)
      } else if (typeof current === 'object' && current && !Array.isArray(current)) {
        Object.entries(current)
          .filter(([, value]) => value)
          .forEach(([key]) => acc.push(key))
      }
      return acc
    }, [])
    .join(' ')
    .trim()
}

/**
 * Type-safe classname combo helper
 * @example cn('px-4', condition && 'bg-red-500', { 'hover:bg-blue': isHoverable })
 */
export function cx(
  ...args: Array<string | undefined | null | false | Record<string, boolean>>
): string {
  return cn(...args)
}
