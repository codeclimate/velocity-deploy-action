import * as core from "@actions/core"
import axios, { AxiosResponse, ResponseType } from "axios"
import { readFileSync } from "fs"
import snake from "snakecase-keys"
import camel from "camelcase-keys"

interface Deploy {
  revision: string
  branch: string
  environment: string | null
  version: string | null
  repositoryUrl: string
}

const DEPLOYS_URL: string =
  process.env.VELOCITY_DEPLOYS_URL || "https://velocity.codeclimate.com/deploys"

const GITHUB_EVENT_PATH: string = process.env.GITHUB_EVENT_PATH as string
const readEvent = (): any =>
  camel(JSON.parse(readFileSync(GITHUB_EVENT_PATH, "utf8")), { deep: true })

const report = (deploy: Deploy): Promise<AxiosResponse<any>> =>
  axios.post(
    DEPLOYS_URL,
    snake({
      ...deploy,
      token: core.getInput("token"),
    }),
    {
      headers: {
        Accept: "application/json",
      },
    }
  )

const run = async (): Promise<void> => {
  const event = readEvent()
  const deploy: Deploy = {
    revision: process.env.GITHUB_SHA as string,
    branch: (process.env.GITHUB_REF as string).replace("refs/heads", ""),
    environment:
      core.getInput("environment") ||
      (event.deployment || {}).environment ||
      null,
    version: core.getInput("version") || null,
    repositoryUrl: event.repository.url,
  }

  core.debug("Reporting deploy to Velocity...")
  core.debug(`revision: ${deploy.revision}`)
  core.debug(`branch: ${deploy.branch}`)
  core.debug(`environment: ${deploy.environment}`)
  core.debug(`version: ${deploy.version}`)

  try {
    await report(deploy)
    core.debug("Reported deploy.")
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
