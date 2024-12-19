const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// // Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/flowcharts", require("./routes/flowchartRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
// app.use("/api/associations", require("./routes/associationRoutes"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
