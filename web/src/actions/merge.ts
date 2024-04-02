"use server";

import axios from "axios";

export default async function merge(form: any) {
  axios
    .post("http://localhost:1323/merge", form)
    .then((res) => console.log(res?.status))
    .catch((err) => console.log(err?.response?.status));
}
