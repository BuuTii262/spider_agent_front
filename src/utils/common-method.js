// 时间格式化
export const formatTime = dateTime => {
  const date = new Date(dateTime * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  function s(t) {
    return t < 10 ? `0${t}` : t;
  }

  return `${year}/${s(month)}/${s(day)} ${s(hours)}:${s(minutes)}:${s(
    seconds
  )}`;
};