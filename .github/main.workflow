workflow "workflow" {
  on = "push"
  resolves = ["Send deployment to Velocity"]
}

action "Send deployment to Velocity" {
  uses = "./"
  secrets = [
    "VELOCITY_DEPLOYMENT_TOKEN",
  ]
}
