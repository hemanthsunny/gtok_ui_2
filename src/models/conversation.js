export default ({
  id: number(),
  userIds: arr(), // sort in asc order. arr of strings
  group: bool(), // true or false
  groupName: str(), // if group is true
  groupImageLink: str(), // store image Url, if it is group conversation
  createdAt: new Date(),
  updatedAt: new Date()
})
