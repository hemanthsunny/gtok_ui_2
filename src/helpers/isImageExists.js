export default (imageUrl) => {
  console.log("COMING", imageUrl);
  const image = document.createElement("IMG");
  image.src = imageUrl;
  console.log("image", image, image.complete, image.height);
  image.onerror = () => {
    return false;
  };
  image.onload = () => {
    return true;
  };
  if (image.height === 0) return false;
  return imageUrl;
};
