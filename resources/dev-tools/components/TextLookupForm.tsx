import * as React from 'react';
import { useState } from 'react'
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { LogEntry, LogEntryItem } from './LogEntry';

/**
 * A button that allows a single field to be submitted & logs displayed underneath.
 */
export interface TextLookupFormProps {
    /**
     * The big header above the button.
     */
    title: string
    /**
     * Main description for what the button will do. Usually wrapped in <p> with <a>'s inside.
     * All translation must be done before passing in the description.
     */
    description: React.JSX.Element,
    /**
     * 2-3 words that appear on the button itself.
     */
    buttonDescription: string
    /*
     * Triggered when users click the button to submit the form.
     * setLogEntries is internally used to display logs to the user as handleSubmit executes.
     * fieldValue represents the value they submitted with the form.
     */
    handleSubmit: (
        setLogEntries: React.Dispatch<React.SetStateAction<LogEntryItem[]>>,
        event: React.FormEvent<HTMLFormElement>,
        fieldValue: string) => void
    /**
     * Optionally include this as an example in the form to hint to users what they should type in.
     */
    formPlaceholder?: string
}

/**
 * A form to look up a single text field and display logs to the user.
 *
 * @param props Text fields for the form / button and a handler when the button is clicked.
 * @returns A single-entry form which displays logs after submitting.
 */
export function TextLookupForm(props: TextLookupFormProps) {
    const { useTranslate } = useThemeHooks()
    const { translate } = useTranslate()

    const { title, description, buttonDescription, formPlaceholder, handleSubmit } = props

    const [logEntries, setLogEntries] = useState<LogEntryItem[]>([])
    const [fieldValue, setFieldValue] = useState("")

    return (
    <div className="p-3 pb-5">
      <form onSubmit={(event) => handleSubmit(setLogEntries, event, fieldValue)}>
          <h4>{translate(title)}</h4>
          {description}
          <div className="input-group">
              <input type="text" className="form-control" required
                  placeholder={translate(formPlaceholder)}
                  onChange={(event) => setFieldValue(event.target.value)}
              />
              <br />
              <button className="btn btn-primary form-control">{translate(buttonDescription)}</button>
          </div>
      </form>
      <br/>
      <br/>
      {logEntries?.length > 0 && <div>
          <h5 className="result-title">{translate(`Result`)}</h5>
          <ul id="log">
              {logEntries.map((log) => {
                  return <LogEntry message={log.message} id={log.id} key={log.id} status={log.status} />
              })}
          </ul>
      </div>}
    </div>)
}
