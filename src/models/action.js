export default ({
  id: number(),
  user: user, //foreign key - OneToOne relationship
  actionTable: str(), //table name - post, user
  actionName: str(), //action name - like, followed
  createdAt: new Date,
  updatedAt: new Date
});
