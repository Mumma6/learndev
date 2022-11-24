import React, { useCallback } from "react"
import { FaChartLine, FaHome, FaList, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { useCurrentUser } from "../../lib/hooks"
import Link from "next/link"
import { fetcher } from "../../lib/fetcher"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

const Header = () => {
  // TODO. Visa massa fler saker, abouts osv-
  return (
    <Navbar className="header">
      <Container>
        <div className="navbar-brand">devlearner</div>
        <Nav className="justify-content-end">
          <Link passHref href="/login" className="nav-link">
            <Button>
              Login <FaSignInAlt />
            </Button>
          </Link>

          <Link passHref href="/sign-up" className="nav-link">
            <Button>Sign Up</Button>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header
