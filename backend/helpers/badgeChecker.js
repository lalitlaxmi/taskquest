const checkBadges = (user, completedTasksCount, proofUploadsCount) => {
  const newBadges = [];

  // First task completed
  if (
    completedTasksCount >= 1 &&
    !user.badges.includes("First Launch")
  ) {
    newBadges.push("First Launch");
  }

  // 50 completed tasks
  if (
    completedTasksCount >= 50 &&
    !user.badges.includes("Half Century")
  ) {
    newBadges.push("Half Century");
  }

  // 100 completed tasks
  if (
    completedTasksCount >= 100 &&
    !user.badges.includes("Century")
  ) {
    newBadges.push("Century");
  }

  // 7 day streak
  if (
    user.streak >= 7 &&
    !user.badges.includes("On Fire")
  ) {
    newBadges.push("On Fire");
  }

  // 10 proof uploads
  if (
    proofUploadsCount >= 10 &&
    !user.badges.includes("Proof Master")
  ) {
    newBadges.push("Proof Master");
  }

  // Level 10
  if (
    user.level >= 10 &&
    !user.badges.includes("Legend")
  ) {
    newBadges.push("Legend");
  }

  return newBadges;
};

module.exports = checkBadges;