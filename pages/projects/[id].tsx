import { GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"

import { handleAuthGetServerSideProps } from "../../lib/utils"

import { findProjectById } from "../../lib/queries/projects"
import { IProjects } from "../../models/Projects"
import Project from "../../components/projects/Project"

export const getServerSideProps: GetServerSideProps = async (context) =>
  handleAuthGetServerSideProps<IProjects>(context, findProjectById, "project")

const projectPage = ({ project }: { project: IProjects }) => {
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
