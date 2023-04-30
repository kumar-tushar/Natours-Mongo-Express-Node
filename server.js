const app = require("./app")
const mongoose = require("mongoose")

mongoose
  .connect(process.env.DATABASE_URL, { useNewURLParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database Connected"))

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
