import http from "./httpServices";
import { apiUrl } from "../config.json";

export async function getGenres() {
  const genres = await http.get(apiUrl + "/genres");
  return genres;
}
