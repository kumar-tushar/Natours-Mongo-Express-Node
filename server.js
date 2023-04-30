require("dotenv").config()
const app = require("./app")
const mongoose = require("mongoose")

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error))

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
