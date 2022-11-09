import Head from "next/head"
import React from "react"
import Login from "../components/auth/Login"

const login = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Login />
    </>
  )
}

export default login
