import React from "react"
import { IProjects } from "../../models/Projects"

interface IProps {
  project: IProjects
}

const Project = ({ project }: IProps) => {
  console.log(project)
  return <div>Project</div>
}

export default Project
