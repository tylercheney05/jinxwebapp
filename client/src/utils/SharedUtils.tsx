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
