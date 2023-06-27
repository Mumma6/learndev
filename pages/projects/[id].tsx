import { type GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"

import { handleAuthGetServerSideProps } from "../../lib/utils"

import { findProjectById } from "../../lib/queries/projects"
import Project from "../../components/projects/Project"
import { ProjectModelSchema, type ProjectModelType } from "../../schema/ProjectSchema"

export const getServerSideProps: GetServerSideProps = async (context) =>
  await handleAuthGetServerSideProps<ProjectModelType>(context, findProjectById, "project", ProjectModelSchema)

const projectPage = ({ project }: { project: ProjectModelType }) => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Project | {project.title}</title>
        </Head>
        <Project project={project} />
      </DashboardLayout>
    </>
  )
}

export default projectPage
