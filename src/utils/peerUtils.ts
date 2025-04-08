export const userIdToPeerId = (userId: string) => {
  const appGuid = import.meta.env.VITE_APP_GUID;
  return `${appGuid}-${userId}`;
};

export const generateUserId = () => {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let userId = "";
  for (let i = 0; i < 11; i++) {
    userId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userId;
};

export const getStoredUserId = () => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    return storedUserId;
  } else {
    const newUserId = generateUserId();
    localStorage.setItem("userId", newUserId);
    return newUserId;
  }
};

export const getStoredUserName = () => {
  const storedUserName = localStorage.getItem("userName");
  return storedUserName || "";
};
