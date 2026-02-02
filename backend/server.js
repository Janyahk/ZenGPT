import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chart.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("ZenGPT Backend is running 🚀");
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB is connected");
  } catch (err) {
    console.log("failed to connect", err);
  }
};
app.use(express.static(path.join(__dirname, "build")));

// For any route not handled by API, serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log("server is runig on port");
  connectDB();
});

// app.post("/test", async (req, res) => {
//   try {
//     let mess=req.body.message;
//     console.log(mess);
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [{ text: mess }],
//   },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     // Safe response handling
//     // res.json({
//     //   reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
//     //   raw: data,
//     // });
// res.send(
//   data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
// );    } catch (error) {
//     console.error("Gemini API error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
