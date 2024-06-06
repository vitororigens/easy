export function currencyMask(value: string) {
    let maskedValue = value;
    maskedValue = maskedValue.replace(/\D/g, '');
    maskedValue = maskedValue.replace(/(\d)(\d{2})$/, '$1,$2');
    maskedValue = maskedValue.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return maskedValue;
}

export function currencyUnMask(maskedValue: string) {
    let UnMaskedValue = parseFloat(maskedValue.replace(/\./, '').replace(/,/,'.'));
    return UnMaskedValue;
}