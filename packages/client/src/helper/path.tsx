   const URL = process.env.IN_PRODUCTION === "true" ? process.env.PRODUCTION_URL :process.env.LOCAL_URL;
   
export const NOTFOUND_URL = "http://localhost:3000/404"; 
export const LOGIN_URL = URL + "/login"; 
export const UNAUTHORIZED_URL = URL + "/unauthorized";
