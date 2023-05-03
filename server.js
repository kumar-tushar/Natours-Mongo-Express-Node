require("dotenv").config({ path: "./.env" })
const app = require("./app")
const mongoose = require("mongoose")

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error))

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 8000}`)
})