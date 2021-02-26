export default ({
  id: number(),
  name: str(),
  uniqName: str(),
  email: str(), //Primary key
  mobile: str(), //Primary key
  dob: str(),
  bio: str(),
  imageLink: str(),
  lastSignedIn: new Date(),
  lastSignedInLoc: str(),
  createdAt: new Date,
  updatedAt: new Date
});
