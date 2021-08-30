import React from 'react'

const convertTextToLink = (text) => {
  const replacePatternOne = /(\b(https?|http):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim // for http, https
  const replacePatternTwo = /(^|[^/])(www\.[\S]+(\b|$))/gim // for www
  const replacePatternThree = /(\n)/gim

  let replacedText = text.replace(replacePatternOne, '<a href="$1" target="_blank" style="color: var(--color-violet-400);">$1</a>')
  replacedText = replacedText.replace(replacePatternTwo, '$1<a href="http://$2" target="_blank"  style="color: var(--color-violet-400);">$2</a>')
  replacedText = replacedText.replace(replacePatternThree, '<br>')

  return <div dangerouslySetInnerHTML={{ __html: replacedText }}></div>
}

export default convertTextToLink
