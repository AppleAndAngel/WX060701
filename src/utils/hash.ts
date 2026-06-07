export const simpleEncrypt = (data: string): string => {
  const key = 'algorithm-divination-house-2024'
  let result = ''
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    result += String.fromCharCode(charCode)
  }
  return btoa(encodeURIComponent(result))
}

export const simpleDecrypt = (encrypted: string): string => {
  try {
    const data = decodeURIComponent(atob(encrypted))
    const key = 'algorithm-divination-house-2024'
    let result = ''
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch {
    return ''
  }
}
