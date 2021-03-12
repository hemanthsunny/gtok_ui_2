export default ({
  id: number(),
  to: user, // foreign key - who receives this alert
  from: user, // who is responsible to this alert
  text: str(), // alert text
  read: bool(),
  readLink: str(), // url
  createdAt: new Date(),
  updatedAt: new Date()
})
