export function getInitials(name: string | undefined): string {
  if (!name) return '';
  const nameArray = name.split(' ');
  const initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join('');
  return initials;
}
