export const getInitials = (name) => {
  if (!name) return "GU";
  const names = name.split(" ");
  if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
  return names[0][0].toUpperCase();
};
