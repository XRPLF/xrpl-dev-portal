import * as React from "react";
import clsx from "clsx";

export interface PersonaPickerOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Pre-translated count line, for example "6 programs" */
  countLabel: string;
}

export interface PersonaPickerProps {
  /** Accessible name for the radiogroup */
  label: string;
  options: PersonaPickerOption[];
  /** Selected persona, or null when every program is shown */
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export interface PersonaPickerHandle {
  /** Moves focus to a tile: the given index, or the current tab stop */
  focus: (index?: number) => void;
}

/**
 * Persona picker for the developer funding hub.
 *
 * A radiogroup of large tiles. Arrow keys, Home and End move the selection,
 * following the WAI-ARIA radio group pattern. Nothing is selected until the
 * visitor chooses, so the first tile takes focus by default. Each tile is
 * named by its title; the description and count are its description, so
 * screen readers hear the same thing on every viewport.
 */
export const PersonaPicker = React.forwardRef<
  PersonaPickerHandle,
  PersonaPickerProps
>(function PersonaPicker({ label, options, selectedId, onSelect }, ref) {
  const tileRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const idPrefix = React.useId();
  const selectedIndex = options.findIndex((option) => option.id === selectedId);
  const tabStopIndex = selectedIndex === -1 ? 0 : selectedIndex;

  React.useImperativeHandle(
    ref,
    () => ({
      focus: (index?: number) =>
        tileRefs.current[index ?? tabStopIndex]?.focus(),
    }),
    [tabStopIndex]
  );

  const selectAt = (index: number) => {
    const option = options[index];
    if (!option) {
      return;
    }
    tileRefs.current[index]?.focus();
    onSelect(option.id);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    // Leave browser and OS shortcuts such as Alt+Left alone
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const last = options.length - 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectAt(next);
  };

  return (
    <div className="funding-hub-personas" role="radiogroup" aria-label={label}>
      {options.map((option, index) => {
        const isSelected = option.id === selectedId;
        const titleId = `${idPrefix}-${option.id}-title`;
        const descriptionId = `${idPrefix}-${option.id}-description`;
        const countId = `${idPrefix}-${option.id}-count`;
        return (
          <button
            key={option.id}
            ref={(element) => {
              tileRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-labelledby={titleId}
            aria-describedby={`${descriptionId} ${countId}`}
            tabIndex={index === tabStopIndex ? 0 : -1}
            className={clsx(
              "funding-hub-persona",
              isSelected && "funding-hub-persona--selected"
            )}
            onClick={() => onSelect(option.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="funding-hub-persona__overlay" aria-hidden="true" />
            <img
              className="funding-hub-persona__icon"
              src={option.icon}
              alt=""
              aria-hidden="true"
            />
            <span id={titleId} className="funding-hub-persona__title sh-sm-l">
              {option.title}
            </span>
            <span
              id={descriptionId}
              className="funding-hub-persona__description body-r"
            >
              {option.description}
            </span>
            <span id={countId} className="funding-hub-persona__count label-r">
              {option.countLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
});

export default PersonaPicker;
