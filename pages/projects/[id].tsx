import { GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"

import { handleAuthGetServerSideProps } from "../../lib/utils"

import { findProjectById } from "../../lib/queries/projects"
import Project from "../../components/projects/Project"
import { ProjectModelSchema, ProjectModelType } from "../../schema/ProjectSchema"

export const getServerSideProps: GetServerSideProps = async (context) =>
  handleAuthGetServerSideProps<ProjectModelType>(context, findProjectById, "project", ProjectModelSchema)

const projectPage = ({ project }: { project: ProjectModelType }) => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Course | {project.title}</title>
        </Head>
        <Project project={project} />
      </DashboardLayout>
    </>
  )
}

export default projectPage
