export const fetcher = (...args: any[]) => {
  console.log(args)
  // @ts-ignore
  return fetch(...args)
    .then(async (res) => {
      console.log(res)
      let payload
      try {
        if (res.status === 204) return null // 204 does not have body
        payload = await res.json()
        console.log(payload)
      } catch (e) {
        /* noop */
      }
      if (res.ok) {
        console.log(payload)
        return payload
      } else {
        return { error: payload.error } || new Error("Something went wrong")
      }
    })
    .catch((e) => {
      console.log(e)
    })
}
