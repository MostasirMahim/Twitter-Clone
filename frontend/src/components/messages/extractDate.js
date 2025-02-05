export function extarctDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
export function extractTime(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();
  const dayName = date.toLocaleString("default", { weekday: "long" });
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const dateFormat = isYesterday ? "Yesterday" : `${dayName}`;

  return `${dateFormat} at ${hours}:${minutes} ${ampm}`;
}
export function extractConversationTime(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const isToday = date.toDateString() === today.toDateString();
  const isLastSevenDays = date > sevenDaysAgo && date < today;

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  if (isToday) {
    return `${hours}:${minutes} ${ampm}`;
  } else if (isLastSevenDays) {
    return date.toLocaleString("default", { weekday: "long" });
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
function padZero(number) {
  return number.toString().padStart(2, "0");
}
