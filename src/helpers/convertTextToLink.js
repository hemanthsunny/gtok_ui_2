import React from "react";

const convertTextToLink = (text) => {
  const replacePatternOne =
    /(\b(https?|http):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim; // for http, https
  const replacePatternTwo = /(^|[^/])(www\.[\S]+(\b|$))/gim; // for www
  // const replacePatternThree = /(@.*)/gim // for @
  const replacePatternFour = /(\n)/gim;

  let replacedText = text.replace(
    replacePatternOne,
    '<a href="$1" target="_blank" style="color: var(--color-violet-400);">$1</a>'
  );
  replacedText = replacedText.replace(
    replacePatternTwo,
    '$1<a href="https://$2" target="_blank"  style="color: var(--color-violet-400);">$2</a>'
  );
  // replacedText = replacedText.replace(replacePatternThree, '<a href="http://localhost:3000/app/profile/$1" style="color: var(--color-violet-400);">$1</a>')
  replacedText = replacedText.replace(replacePatternFour, "<br>");

  return <span dangerouslySetInnerHTML={{ __html: replacedText }}></span>;
};

export default convertTextToLink;
