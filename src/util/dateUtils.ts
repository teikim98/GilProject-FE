export const getTimeAgo = (dateString: string | undefined | null): string => {
  if (!dateString) {
    return "방금 전";
  }

  const past = new Date(dateString);
  past.setHours(past.getHours() + 9);

  const now = new Date();

  console.log("past =>" + past);
  console.log("now => " + now);

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // 1분 미만
  if (diffInSeconds < 60) {
    return "방금 전";
  }
  // 1시간 미만
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  // 24시간 미만
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  // 7일 미만
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }
  // 7일 이상
  return past.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 9);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
