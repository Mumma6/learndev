import React from "react"
import { Box, Divider, Typography, Button } from "@mui/material"
import Icon from "@mui/material/Icon"
import { FaPen, FaTrash } from "react-icons/fa"
import { UserWorkexperienceSchemaType } from "../../schema/UserSchema"

interface IProps {
  work: UserWorkexperienceSchemaType
  deleteWorkexperience: (work: UserWorkexperienceSchemaType) => void
}

// en prop för delete function

const WorkexperienceCard = ({ work, deleteWorkexperience }: IProps) => {
  const { role, company, startDate, endDate, currentJob, description } = work
  return (
    <Box
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        backgroundColor: "#F8F9FA",
      }}
      borderRadius="lg"
      p={3}
      mb={1}
      mt={2}
    >
      <Box width="100%" display="flex" flexDirection="column">
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

          <Box display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <Box mr={1}>
              <Button variant="text" color="info">
                <FaPen style={{ marginRight: 5 }} /> edit
              </Button>
            </Box>
            <Button onClick={() => deleteWorkexperience(work)} variant="text" color="error">
              <FaTrash style={{ marginRight: 5 }} /> delete
            </Button>
          </Box>
        </Box>
        <Box mb={1} lineHeight={0}>
          <Typography variant="caption" color="text">
            Company:&nbsp;&nbsp;&nbsp;
            <Typography variant="caption" fontWeight="medium" textTransform="capitalize">
              {company}
            </Typography>
          </Typography>
        </Box>
        <Box mb={1} lineHeight={0}>
          <Typography variant="caption" color="text">
            Start date:&nbsp;&nbsp;&nbsp;
            <Typography variant="caption" fontWeight="medium">
              {startDate}
            </Typography>
          </Typography>
        </Box>

        <Typography mb={1} variant="caption" color="text">
          End date:&nbsp;&nbsp;&nbsp;
          <Typography variant="caption" fontWeight="medium">
            {currentJob ? "-" : endDate}
          </Typography>
        </Typography>

        <Typography variant="subtitle1" color="text">
          description:
        </Typography>
        <Typography variant="caption" color="text">
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

export default WorkexperienceCard
