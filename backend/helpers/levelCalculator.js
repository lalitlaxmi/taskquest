const calculateLevel = (xp) => {
  let level = Math.floor(xp / 100) + 1;

  if (level > 10) {
    level = 10;
  }

  return level;
};

module.exports = calculateLevel;