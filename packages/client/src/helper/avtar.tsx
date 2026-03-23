export const AVTAR_URL = "https://avatars.dicebear.com/api/identicon/";
export const USER_AVTAR_URL = "https://api.dicebear.com/7.x/initials/svg?seed=";
export const generateDicebearUrl = (firstName, lastName) => {
  const firstInitial = (firstName && firstName.trim().charAt(0).toUpperCase()) ;
  const lastInitial = (lastName && lastName.trim().charAt(0).toUpperCase()) ;

  if (firstInitial && lastInitial) {
  const seed = `${firstInitial}${lastInitial}`;
  const url = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
  return url;
  }
};