export default ({
  id: number(),
  user: user, //foreign key - OneToOne relationship
  conversation: conversation, // foreign key
  type: str(), // message type - text, file, voice
  text: str(), // currently,
  read: bool(),
  createdAt: new Date,
  updatedAt: new Date
});
