import app from "./app";

//initialize express server with a env variable PORT
const { PORT } = require('./util/config');

const { connectToDatabase } = require('./util/db');

app.listen(PORT, async() => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});