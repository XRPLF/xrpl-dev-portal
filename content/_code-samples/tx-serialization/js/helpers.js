'use strict';

module.exports = {

    isAmountObject : function (arg) {
        const keys = Object.keys(arg).sort()
        return (
            keys.length === 3 &&
            keys[0] === 'currency' &&
            keys[1] === 'issuer' &&
            keys[2] === 'value'
        )
    },

    sortFuncCanonical : function (a, b) {
        a = this.fieldSortKey(a)
        b = this.fieldSortKey(b)
        return a.typeCode - b.typeCode || a.fieldCode - b.fieldCode
    }

}