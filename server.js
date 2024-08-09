import express from "express";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});