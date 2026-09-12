import { Client as Workflow } from "@upstash/workflow";

export const workflow = new Workflow({
    baseUrl:process.env.QSTASH_URL,
    token:process.env.QSTASH_TOKEN
})

