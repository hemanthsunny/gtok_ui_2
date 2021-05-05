lsof -t -i tcp:5000 | xargs kill
lsof -t -i tcp:5001 | xargs kill
lsof -t -i tcp:8080 | xargs kill
lsof -t -i tcp:9000 | xargs kill
lsof -t -i tcp:9099 | xargs kill

firebase emulators:start --import=./saved-data --export-on-exit=./saved-data

other_commands() {
  echo "CTRL+C"
  firebase emulators:exec --export-on-exit=./saved-data
}
trap 'other_commands' SIGINT

wait
