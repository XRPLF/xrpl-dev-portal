import * as React from 'react';
import { useState } from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { clsx } from 'clsx'
import { isValidAddress } from 'xrpl'

function onDestinationAddressChange(
    event: React.ChangeEvent<HTMLInputElement>, 
    setDestinationAddress: React.Dispatch<React.SetStateAction<string>>, 
    setIsValidDestinationAddress: React.Dispatch<React.SetStateAction<boolean>>
): void {
    const newAddress = event.target.value
    setDestinationAddress(newAddress)
    setIsValidDestinationAddress(isValidAddress(newAddress))
}

export interface DestinationAddressInputProps {
    defaultDestinationAddress: string, 
    destinationAddress: string, 
    setDestinationAddress: React.Dispatch<React.SetStateAction<string>>, 
}

export function DestinationAddressInput(
    {
        defaultDestinationAddress, 
        destinationAddress, 
        setDestinationAddress, 
    } : DestinationAddressInputProps
): React.JSX.Element {
    const { useTranslate } = useThemeHooks();
    const { translate } = useTranslate()
    const [ isValidDestinationAddress, setIsValidDestinationAddress ] = useState(true)
    
    return (
    <div>
        <div className="form-group">
            <label htmlFor="destination_address">
                {translate("Destination Address")}
            </label>
            <input type="text" className={clsx("form-control", 
                // Defaults to not having "is-valid" / "is-invalid" classes
                (destinationAddress !== defaultDestinationAddress) && (isValidDestinationAddress ? "is-valid" : "is-invalid"))}
                id="destination_address" 
                onChange={(event) => onDestinationAddressChange(event, setDestinationAddress, setIsValidDestinationAddress)}
                aria-describedby="destination_address_help" 
                defaultValue={destinationAddress} />
            <small id="destination_address_help" className="form-text text-muted">
                {translate("Send transactions to this XRP Testnet address")}
            </small>
        </div>
        <p className={clsx("devportal-callout caution", !(isValidDestinationAddress && destinationAddress[0] === 'X') && "collapse")}
            id="x-address-warning">
            <strong>{translate("Caution:")}</strong>
            {translate(" This X-address is intended for use on Mainnet. Testnet X-addresses have a \"T\" prefix instead.")}
        </p>
    </div>)
}
