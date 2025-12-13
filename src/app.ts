import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";

const app: Application = express();

//Middlewares

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taasu-soap.web.app",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://admin-taasu-soap.netlify.app",
    ],
    credentials: true,
  })
);

app.get("/api/v1/test", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "test",
    data: null,
  });
});

//All routes
app.use("/api/v1", router);

//Not found
app.use(notFound);

export default app;
