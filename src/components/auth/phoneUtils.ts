import LookUpService from '@/services/LookUpService'

export async function fetchCountryCodeMapping(): Promise<{ cleanCode: string }[]> {
  try {
    const response = await LookUpService.dailcode()
    if (response) {
      const countryCodeMapping = Object.values(response).map((item: any) => ({
        cleanCode: item.dailcode
      }))

      return countryCodeMapping
    } else {
      throw new Error('Failed to fetch country code mapping')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function formatPhoneNumber(
  selectedCountryCode: string,
  phoneNumber: string,
  countryCodeMapping: { cleanCode: string }[]
): string {
  const cleanedSelectedCountryCode = selectedCountryCode.replace('+', '')

  const selectedCountry = countryCodeMapping.find(
    (country) => country.cleanCode === cleanedSelectedCountryCode
  )

  if (selectedCountry) {
    const cleanedCode = selectedCountry.cleanCode

    if (phoneNumber.startsWith(cleanedCode)) {
      return phoneNumber
    } else if (phoneNumber.startsWith(cleanedSelectedCountryCode)) {
      const formattedNumber = cleanedCode + phoneNumber.slice(cleanedSelectedCountryCode.length)

      if (formattedNumber.charAt(cleanedSelectedCountryCode.length) === '0') {
        return (
          formattedNumber.slice(0, cleanedSelectedCountryCode.length) +
          formattedNumber.slice(cleanedSelectedCountryCode.length + 1)
        )
      }

      return formattedNumber
    } else {
      return cleanedCode + phoneNumber
    }
  } else {
    const formattedNumber = selectedCountryCode.replace('+', '') + phoneNumber

    if (formattedNumber.charAt(cleanedSelectedCountryCode.length) === '0') {
      return (
        formattedNumber.slice(0, cleanedSelectedCountryCode.length) +
        formattedNumber.slice(cleanedSelectedCountryCode.length + 1)
      )
    }

    return formattedNumber
  }
}
