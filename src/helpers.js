export const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

export const getRandomImageRotationOffset = () => {
  return getRandomInt(2) / 10 - .1;
}

export const getRandomImageTimeOffset = () => {
  return getRandomInt(100);
}