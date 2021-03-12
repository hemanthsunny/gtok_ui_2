const truncateText = (text, limit = 100) => {
  let truncateFormat = text.substring(0, limit)
  if (text.length > limit) truncateFormat += '...'
  return truncateFormat
}

export default truncateText
