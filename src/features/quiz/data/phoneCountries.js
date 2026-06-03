// Country dial codes + display masks for the phone field in the intro form.
// `mask`: each '#' is a digit slot; every other character is rendered literally.
export const phoneCountries = {
  UA: { name: 'Україна', flag: '🇺🇦', code: '+380', mask: '## ### ## ##', digits: 9, ph: '67 123 45 67', max: 14 },
  US: { name: 'United States', flag: '🇺🇸', code: '+1', mask: '(###) ###-####', digits: 10, ph: '(555) 123-4567', max: 14 },
  GB: { name: 'United Kingdom', flag: '🇬🇧', code: '+44', mask: '## #### ####', digits: 10, ph: '20 7946 0958', max: 13 },
  PL: { name: 'Polska', flag: '🇵🇱', code: '+48', mask: '### ### ###', digits: 9, ph: '512 345 678', max: 11 },
  DE: { name: 'Deutschland', flag: '🇩🇪', code: '+49', mask: '### #######', digits: 10, ph: '152 1234567', max: 11 },
  FR: { name: 'France', flag: '🇫🇷', code: '+33', mask: '# ## ## ## ##', digits: 9, ph: '6 12 34 56 78', max: 13 },
  IT: { name: 'Italia', flag: '🇮🇹', code: '+39', mask: '### ### ####', digits: 10, ph: '312 345 6789', max: 12 },
  ES: { name: 'España', flag: '🇪🇸', code: '+34', mask: '### ### ###', digits: 9, ph: '612 345 678', max: 11 },
  CZ: { name: 'Česko', flag: '🇨🇿', code: '+420', mask: '### ### ###', digits: 9, ph: '601 234 567', max: 11 },
  AE: { name: 'United Arab Em.', flag: '🇦🇪', code: '+971', mask: '## ### ####', digits: 9, ph: '50 123 4567', max: 11 },
  IL: { name: 'Israel', flag: '🇮🇱', code: '+972', mask: '## ### ####', digits: 9, ph: '50 123 4567', max: 11 },
  CA: { name: 'Canada', flag: '🇨🇦', code: '+1', mask: '(###) ###-####', digits: 10, ph: '(416) 555-1234', max: 14 },
  AU: { name: 'Australia', flag: '🇦🇺', code: '+61', mask: '### ### ###', digits: 9, ph: '412 345 678', max: 11 }
}

export const DEFAULT_PHONE_COUNTRY = 'UA'

// Browser/OS autocomplete hints, keyed by quiz field name.
export const autocompleteByField = {
  first_name: 'given-name',
  last_name: 'family-name',
  email: 'email',
  phone: 'tel',
  zip: 'postal-code',
  city: 'address-level2',
  address: 'street-address',
  firm_name: 'organization',
  company_name: 'organization',
  referral_code: 'off',
  about: 'off'
}

// Apply a phone mask to a string of raw digits.
export function formatPhone(digits, mask) {
  let out = ''
  let digitIndex = 0
  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    out += mask[i] === '#' ? digits[digitIndex++] : mask[i]
  }
  return out
}
