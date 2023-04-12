import { GetServerSideProps } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import React from "react"
import ForgotPasswordToken from "../../components/auth/ForgotPasswordToken"
import { getMongoDb } from "../../lib/mongodb"
import { findTokenByIdAndType } from "../../lib/queries/token"

interface IParams extends ParsedUrlQuery {
  token: any
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const db = await getMongoDb()

  const { token } = context.params as IParams

  const tokenDoc = await findTokenByIdAndType(db, token, "passwordReset")

  return { props: { token: token, valid: !!tokenDoc } }
}

const ResetPasswordTokenPage = ({ valid, token }: { valid: boolean; token: any }) => {
  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <ForgotPasswordToken valid={valid} token={token} />
    </>
  )
}

export default ResetPasswordTokenPage
