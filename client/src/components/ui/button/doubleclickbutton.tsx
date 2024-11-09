import React, { useState, useRef, useEffect, MutableRefObject } from "react"
import { Button } from "../button"
import { DoubleCheckIcon, WarningIcon } from "components/Icons"
import { ButtonProps } from "../button"
import { Alert, AlertTitle, AlertDescription } from "../alert"
import { cn } from "lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip"

interface Props extends ButtonProps {
  alertMsg?: string
  confirmButtonClassName?: string
  smallConfirm?: boolean
}

function useOutsideAlerter(
  ref: MutableRefObject<HTMLButtonElement>,
  setFirstClick: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFirstClick(true)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

function useScrollHandler(ref: MutableRefObject<HTMLDivElement>, firstClick: boolean) {
  useEffect(() => {
    if (!firstClick) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [firstClick])
}

const DoubleClickButton = ({
  onClick,
  variant = "default",
  alertMsg = "",
  confirmButtonClassName,
  smallConfirm = false,
  ...props
}: Props) => {
  const [firstClick, setFirstClick] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  useOutsideAlerter(buttonRef as MutableRefObject<HTMLButtonElement>, setFirstClick)
  useScrollHandler(alertRef as MutableRefObject<HTMLDivElement>, firstClick)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) {
      onClick(e)
    }
    setFirstClick(true)
  }

  return (
    <>
      {firstClick ? (
        <Button onClick={() => setFirstClick(false)} variant={variant} {...props} />
      ) : (
        <div>
          <Button
            ref={buttonRef}
            className={cn("mb-1", confirmButtonClassName)}
            onClick={(e) => handleClick(e)}
            variant={variant}
            {...props}
          >
            <div className="flex gap-2">
              <WarningIcon />
              {smallConfirm ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <DoubleCheckIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click button again to confirm your action.</p>
                      <p>Click anywhere else to cancel.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                "Click to confirm"
              )}
            </div>
          </Button>
          {!smallConfirm ? (
            <Alert ref={alertRef} variant={variant}>
              <AlertTitle className="font-bold">Heads up!</AlertTitle>
              <AlertDescription>
                {alertMsg ? alertMsg : "Click button again to confirm your action. Click anywhere else to cancel."}
              </AlertDescription>
            </Alert>
          ) : (
            <div ref={alertRef}></div>
          )}
        </div>
      )}
    </>
  )
}
export default DoubleClickButton
