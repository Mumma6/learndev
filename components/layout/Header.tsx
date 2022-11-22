import React, { useCallback } from "react"
import { FaChartLine, FaHome, FaList, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { useCurrentUser } from "../../lib/hooks"
import Link from "next/link"
import { fetcher } from "../../lib/fetcher"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

const Header = () => {
  const { data: { user } = {}, mutate } = useCurrentUser()

  const router = useRouter()

  const onSignOut = useCallback(async () => {
    try {
      await fetcher("/api/auth", {
        method: "DELETE",
      })
      toast.success("You have been signed out")
      mutate({ user: null })
      router.replace("/")
    } catch (e: any) {
      toast.error(e.message)
    }
  }, [mutate])

  // Ska likna headern från Designen.
  const loggedIn = (
    <>
      <Link href="/dashboard" passHref className="nav-link">
        <FaHome /> Dashboard
      </Link>
      <Button onClick={onSignOut}>
        <FaSignOutAlt /> Sign out
      </Button>
    </>
  )

  // TODO. Visa massa fler saker, abouts osv-
  return (
    <Navbar style={{ marginBottom: 20 }}>
      <Container>
        <div className="navbar-brand">devlearner</div>
        <Nav className="justify-content-end">
          {user ? (
            loggedIn
          ) : (
            <>
              <Link passHref href="/login" className="nav-link">
                <Button>
                  Login <FaSignInAlt />
                </Button>
              </Link>

              <Link passHref href="/sign-up" className="nav-link">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header
