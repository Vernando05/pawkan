
function toCapitalize (text: string): string {
  return text.charAt(0).toUpperCase() + text.substring(1);
}

export { toCapitalize }