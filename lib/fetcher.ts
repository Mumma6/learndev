export const fetcher = (...args: [string, Object]) => {
  console.log(args)
  return fetch(...args)
    .then(async (res) => {
      console.log(res, " res fetcher")
      let payload
      try {
        if (res.status === 204) return null // 204 does not have body
        payload = await res.json()
      } catch (e) {
        /* noop */
      }
      if (res.status === 401) {
        console.log(payload)
        return { error: payload?.error || "Email or password is incorrect" }
      }
      if (res.ok) {
        return payload
      } else {
        return { error: payload?.error || payload?.message } || new Error("Something went wrong")
      }
    })
    .catch((e) => {
      console.log(e, " error catch")
    })
}
