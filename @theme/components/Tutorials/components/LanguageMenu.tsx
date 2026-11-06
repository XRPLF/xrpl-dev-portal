import { useThemeHooks } from "@redocly/theme/core/hooks"
import { useEffect, useId, useRef, useState } from "react"
import clsx from "clsx"
import { MaterialKeyboardArrowDownIcon } from "shared/components/Icons"
import { LANGUAGES, OTHER_LANGUAGES } from "../model"

/**
 * Language filter as a dropdown, styled like the navbar's language switcher:
 * the button reuses its pill styling and the list reuses its dropdown classes.
 */
export function LanguageMenu({ value, onChange }: { value: string | null; onChange: (value: string | null) => void }) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const options: { key: string | null; label: string }[] = [
    { key: null, label: translate("All languages") },
    ...LANGUAGES.map((lang) => ({ key: lang.key, label: translate(lang.label) })),
    { key: OTHER_LANGUAGES, label: translate("Other") },
  ]
  const selectedIndex = Math.max(0, options.findIndex((option) => option.key === value))

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) itemRefs.current[selectedIndex]?.focus()
  }, [open, selectedIndex])

  const choose = (key: string | null) => {
    onChange(key)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onItemKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null
    if (event.key === "ArrowDown") next = (index + 1) % options.length
    else if (event.key === "ArrowUp") next = (index + options.length - 1) % options.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = options.length - 1
    else if (event.key === "Tab") {
      // Tab closes the menu. Focus goes back to the button first, because the
      // options unmount and a focused element that disappears drops focus to
      // the page body.
      buttonRef.current?.focus()
      setOpen(false)
    }
    if (next === null) return
    event.preventDefault()
    itemRefs.current[next]?.focus()
  }

  return (
    <div className="tutorials-select" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={clsx("tutorials-select__button label-r", open && "is-open")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((state) => !state)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="visually-hidden">{translate("Filter by language")}: </span>
        {options[selectedIndex].label}
        <MaterialKeyboardArrowDownIcon className="tutorials-select__icon" aria-hidden="true" />
      </button>
      {open && (
        <div
          id={menuId}
          className="bds-lang-dropdown tutorials-select__menu"
          role="listbox"
          aria-label={translate("Filter by language")}
        >
          {options.map((option, index) => (
            <button
              key={option.key ?? "all"}
              ref={(el) => { itemRefs.current[index] = el }}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={index === selectedIndex ? 0 : -1}
              className={clsx("bds-lang-dropdown__item", index === selectedIndex && "bds-lang-dropdown__item--active")}
              onClick={() => choose(option.key)}
              onKeyDown={(event) => onItemKeyDown(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
