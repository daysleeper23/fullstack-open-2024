import app from "./app";

//initialize express server with a env variable PORT
const { PORT } = require('./util/config');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});