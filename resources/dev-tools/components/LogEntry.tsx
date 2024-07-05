import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { clsx } from 'clsx'

export const CLASS_GOOD = "badge badge-success"
export const CLASS_BAD = "badge badge-danger"

export interface LogEntryStatus {
    icon?: {
      label: string,
      type: "SUCCESS" | "ERROR"
      check?: boolean
    }
    followUpMessage?: JSX.Element
}

export interface LogEntryItem {
    message: string
    id: string
    status?: LogEntryStatus
}

/**
 * Add entry to the end of the value that setLogEntries modifies.
 *
 * @param setLogEntries - A setter to modify a list of LogEntries
 * @param entry - Data for a new LogEntry
 */
export function addNewLogEntry(
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    entry: LogEntryItem)
{
    setLogEntries((prev) => {
        return [...prev, entry]
    })
}

/**
 * Looks up an existing log entry from the previous value within setLogEntries which has
 * the same id as entry.id. Then it updates that value to equal entry.
 *
 * Primarily used to update the "status" after verifying a field.
 *
 * @param setLogEntries - A setter to modify a list of LogEntries.
 * @param entryToUpdate - Updated data for an existing LogEntry.
 */
export function updateLogEntry(
    setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
    entryToUpdate: LogEntryItem) {
    setLogEntries((prev) => {
        const index = prev.findIndex((entry)=> entryToUpdate.id === entry.id)
        prev.splice(index, 1, entryToUpdate)
        return [...prev]
    })
}

export function LogEntry({
    message,
    id,
    status
}: LogEntryItem)
{
    const { useTranslate } = useThemeHooks();
    const {translate} = useTranslate()
    let icon = undefined
    if(!!(status?.icon)) {
        icon = <span className={
            clsx(status.icon?.type === "SUCCESS" && CLASS_GOOD,
            status.icon?.type === "ERROR" && CLASS_BAD)}>
                {status.icon?.label}
                {status.icon?.check && <i className="fa fa-check-circle"/>}
        </span>
    }

    return (
        <li id={id}>{translate(`${message} `)}{icon}{status?.followUpMessage}</li>
    )
}
