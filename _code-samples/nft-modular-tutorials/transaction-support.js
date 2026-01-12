// ****************************************
// ********* Configure Amount *************
// ****************************************

function configureAmount() {
  let amount = ''
  if (currencyField.value === 'XRP' || currencyField.value === '') {
    if (amountField.value !== '') {
      amount = amountField.value // XRP amount should be a string of drops
    } else {
      amount = undefined
    }
  } else if (currencyField.value !== '') {
    amount = {
      currency: currencyField.value,
      issuer: issuerField.value,
      value: amountField.value,
    }
  } else {
    amount = undefined // Or handle the case where no currency is provided
  }
  return amount
}

// ****************************************
// ********* Configure Expiration *********
// ****************************************

function configureExpiration() {
  let expiration = ''
  var days = expirationField.value
  let d = new Date()
  d.setDate(d.getDate() + parseInt(days))
  expiration = xrpl.isoTimeToRippleTime(d)
  return expiration
} // End of configureExpiration()
