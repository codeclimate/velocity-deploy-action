import * as core from "@actions/core"
import axios, { AxiosResponse } from "axios"
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
  camel(JSON.parse(readFileSync(GITHUB_EVENT_PATH, "utf8")))

const report = (deploy: Deploy): Promise<AxiosResponse<any>> =>
  axios.post(
    DEPLOYS_URL,
    snake({
      ...deploy,
      token: process.env.VELOCITY_DEPLOYMENT_TOKEN,
    })
  )

const main = (): void => {
  try {
    const event = readEvent()

    report({
      revision: process.env.GITHUB_SHA as string,
      branch: process.env.GITHUB_REF as string,
      environment:
        core.getInput("environment") || (event.deployment || {}).environment,
      version: core.getInput("version"),
      repositoryUrl: event.repository.webUrl,
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
