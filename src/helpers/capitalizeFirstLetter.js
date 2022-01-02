const capitalizeFirstLetter = (text) => {
  text = text.trim();
  text = text[0].toUpperCase() + text.slice(1);
  return text;
};

export default capitalizeFirstLetter;
