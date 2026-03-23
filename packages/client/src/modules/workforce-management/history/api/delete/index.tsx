import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
export const deleteConfigDetails = async function (id : string) {
    return await axios.delete(
      process.env.PROJECT_API + "/admin-config/activity/delete?activityId="+ id,apiAuthenticationHeader
    );
};
