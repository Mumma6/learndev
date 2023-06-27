import React from "react"
import { Box, Typography } from "@mui/material"
import { type UserWorkexperienceSchemaType } from "../../../schema/UserSchema"

interface IProps {
  work: UserWorkexperienceSchemaType
}

const WorkCard = ({ work }: IProps) => {
  const { role, company, startDate, endDate, currentJob, description } = work
  return (
    <Box
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        backgroundColor: "#F8F9FA"
      }}
      borderRadius="lg"
      mb={1}
      mt={2}
      pt={1}
      pb={1}
    >
      <Box ml={3} width="100%" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <Typography variant="subtitle1" textTransform="capitalize">
            Role: {role}
          </Typography>
        </Box>
        <Box lineHeight={0}>
          <Typography variant="caption" color="text">
            Company:&nbsp;&nbsp;&nbsp;
            <Typography variant="caption" fontWeight="medium" textTransform="capitalize">
              {company}
            </Typography>
          </Typography>
        </Box>
        <Box lineHeight={0}>
          <Typography variant="caption" color="text">
            Start date:&nbsp;&nbsp;&nbsp;
            <Typography variant="caption" fontWeight="medium">
              {startDate}
            </Typography>
          </Typography>
        </Box>

        <Typography variant="caption" color="text">
          End date:&nbsp;&nbsp;&nbsp;
          <Typography variant="caption" fontWeight="medium">
            {currentJob ? "-" : endDate}
          </Typography>
        </Typography>
        <Box lineHeight={0}>
          <Typography variant="caption" color="text">
            description:&nbsp;&nbsp;&nbsp;
            <Typography variant="caption" fontWeight="medium">
              {description}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default WorkCard
