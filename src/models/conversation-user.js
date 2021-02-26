export default ({
  id: number(),
  user: user, //foreign key - OneToOne relationship
  conversation: conversation, // foreign key
  lastSeen: new Date,
  createdAt: new Date,
  updatedAt: new Date
});
