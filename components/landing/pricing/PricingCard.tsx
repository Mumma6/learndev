import React from "react"
import {
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardActions,
} from "@mui/material"
import { FaCheck } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import Link from "next/link"

interface IFeatures {
  id: number
  isAvailable: boolean
  title: string
}

interface IProps {
  data: {
    price: number
    isRecommended: boolean
    buttonText: string
    features: IFeatures[]
    type: string
  }
}

const PricingCard = ({ data }: IProps) => {
  const { price, isRecommended, buttonText, features, type } = data
  return (
    <Box
      padding={1}
      sx={{
        border: 4,
        borderRadius: "16px",
        borderColor: isRecommended ? "primary.main" : "#c7c7c7",
        backgroundColor: isRecommended ? "#eeeeee" : null,
      }}
    >
      <Box mt={4}>
        <Grid mb={5} container justifyContent={"space-around"}>
          <Grid item>
            <Typography variant="h4" component="div">
              {type}
            </Typography>
          </Grid>
          {price !== 0 && (
            <Grid item>
              <Typography color={"primary"} variant="h4" component="div">
                {`${price}/mo`}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider />
        <Box mt={5}>
          <List sx={{ marginBottom: 10 }}>
            {features.map((feature) => (
              <ListItem>
                <ListItemIcon>
                  {feature.isAvailable ? <FaCheck color="#14B8A6" /> : <ImCross color="#e1e1e1" />}
                </ListItemIcon>
                <ListItemText primary={feature.title} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box mt={10} ml={3} mb={1}>
            <Link style={{ textDecoration: "none" }} href="/sign-up" passHref>
              <Button disabled={type === "Premium"} size="large" color="primary" variant="contained">
                {buttonText}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PricingCard
