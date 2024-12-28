import { useEffect, useRef } from "react"

export const useDidMountEffect = (func: any, deps: any) => {
  /// This useEffect will only run AFTER the initial page render
  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) {
      func()
    } else {
      didMount.current = true
    }
  }, deps)
}

export const convertBooleanToString = (params: object) => {
  return new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()
}
