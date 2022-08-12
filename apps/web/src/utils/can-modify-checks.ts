export const canDelete = (loggedInId?: string | null, addedById?: string) => {
  return loggedInId && loggedInId === addedById;
};
