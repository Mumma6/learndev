import { Box, Button, Divider, Grid, MenuItem, Typography } from "@mui/material"
import { Container } from "@mui/system"
import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

const aboutUs = ["Offers", "Values", "Policy"]
const company = ["Careers & Culture", "Blog", "Press"]
const faq = ["GDPR", "Donation", "Press"]

const LandingFooter = () => {
  return (
    <div
      style={{ backgroundColor: "white", boxShadow: "1px 0px 5px rgb(100 116 139 / 12%)", paddingTop: 1, paddingBottom: 40 }}
    >
      <Container sx={{ mt: 10 }}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <div>
              <Typography variant="h5" gutterBottom>
                Company
              </Typography>
              {company.map((page) => (
                <Box key={page} sx={{ flexGrow: 1, display: { xs: "none", md: "flex", justifyContent: "center" } }}>
                  <Button sx={{ color: "black", display: "block", fontWeight: 300 }}>{page}</Button>
                </Box>
              ))}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <Typography variant="h5" gutterBottom>
                About us
              </Typography>

              {aboutUs.map((page) => (
                <Box key={page} sx={{ flexGrow: 1, display: { xs: "none", md: "flex", justifyContent: "center" } }}>
                  <Button key={page} sx={{ color: "black", display: "block", fontWeight: 300 }}>
                    {page}
                  </Button>
                </Box>
              ))}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <Typography variant="h5" gutterBottom>
                FAQ
              </Typography>
              {faq.map((page) => (
                <Box key={page} sx={{ flexGrow: 1, display: { xs: "none", md: "flex", justifyContent: "center" } }}>
                  <Button key={page} sx={{ color: "black", display: "block", fontWeight: 300 }}>
                    {page}
                  </Button>
                </Box>
              ))}
            </div>
          </Grid>
        </Grid>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <h1>Studify</h1>
      </Container>
    </div>
  )
}

export default LandingFooter
