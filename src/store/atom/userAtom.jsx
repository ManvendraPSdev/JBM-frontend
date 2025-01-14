// store/atom/authAtom.js
import { atom, selector } from "recoil";
import axios from "../../utils/axios";

export const userState = atom({
  key: "user",
  default: selector({
    key: "user/default",
    get: async () => {
      try {
        const response = await axios.get("/user/current-user", {
          withCredentials: true,
        });
        return response.data.data;
      } catch (error) {
        return {};
      }
    },
  }),
});