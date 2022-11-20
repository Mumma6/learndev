import { GetServerSideProps } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import React from "react"
import ForgotPasswordToken from "../../components/auth/ForgotPasswordToken"
import { getMongoDb } from "../../lib/mongodb"
import { findTokenByIdAndType } from "../../lib/queries/token"
/*

_id
637a2e379e43fcb81b4686c0
securedTokenId
"qxKSN6yAxOa65SyYI5_GGwYP"
creatorId
636b770dd13cab6be97eb16d
type
"passwordReset"
expireAt
2022-11-20T14:00:07.433+00:00
*/
interface IParams extends ParsedUrlQuery {
  token: any
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const db = await getMongoDb()

  const { token } = context.params as IParams

  const tokenDoc = await findTokenByIdAndType(db, token, "passwordReset")

  console.log(tokenDoc)

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
