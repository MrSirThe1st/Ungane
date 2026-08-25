export function customerDisplayName(c: {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
}) {
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
  return name || c.phoneNumber;
}
