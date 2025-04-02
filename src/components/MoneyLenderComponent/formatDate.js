export const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "Invalid Date";
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" });
    return formatter.format(date);
  };