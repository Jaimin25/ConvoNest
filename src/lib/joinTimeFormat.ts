export const joinTimeFormat = (joinedAt: Date) => {
  const userJoinDate = joinedAt;
  const joinDate = new Date(userJoinDate);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - joinDate.getTime();

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else if (seconds > 1) {
    return `${seconds}s`;
  } else {
    return `now`;
  }
};
