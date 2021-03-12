const convertTextToJson = (text) => {
  text = text.split('\n')
  const jsonFormat = {
    title: text[0].trim(),
    sub_title: text[1].trim(),
    category: text[2].trim(),
    values: []
  }
  const keys = text[3].split(',')

  for (let i = 4; i < text.length; i++) {
    const line = text[i].split(',')
    const list = {}
    for (const k in keys) {
      list[keys[k]] = line[k].trim()
    }
    if (
      list.type === 'radio' ||
      list.type === 'dropdown' ||
      list.type === 'checkbox'
    ) {
      list.value = list.value.split('/')
    }

    jsonFormat.values.push(list)
  }

  return jsonFormat
}

export default convertTextToJson
