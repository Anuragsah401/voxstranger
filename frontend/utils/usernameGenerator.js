const adjectives = [
  "Midnight",
  "Emerald",
  "Silent",
  "Brave",
  "Crimson",
  "Mystic",
  "Golden",
  "Vibrant",
  "Shadow",
  "Frost",
  "Lunar",
  "Solar",
  "Velvet",
  "Swift",
  "Azure",
];

const nouns = [
  "Falcon",
  "Voyager",
  "Phoenix",
  "Ocean",
  "Seeker",
  "Walker",
  "Ghost",
  "Knight",
  "Panda",
  "Eagle",
  "Comet",
  "Nomad",
  "Raven",
  "Titan",
  "Star",
];

export const generateUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 99) + 1;
  return `${adj} ${noun} ${number}`;
};
