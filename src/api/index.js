import axios from "axios";
export function getJockList(params) {
  return axios.get("https://v1.alapi.cn/api/joke", {
    params
  });
}

export function getGirlsList({ page = 1, count = 10 }) {
  return axios.get(
    `https://gank.io/api/v2/data/category/Girl/type/Girl/page/${page}/count/${count}`
  );
}
