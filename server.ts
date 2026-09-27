import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/register", (req, res) => {
    const { name, phone, email, location, interest, roomType, messPlan, visitDate, tourType, message } = req.body;
    const inquiryId = `AES-${Math.floor(10000 + Math.random() * 90000)}`;
    console.log(`New inquiry [${inquiryId}]: ${name}, ${phone}, ${location}, ${interest}, ${roomType}`);
    
    // Broadcast to all connected clients (including the owner if they have the app open)
    io.emit("new_registration", { 
      inquiryId,
      name, 
      phone, 
      email,
      location, 
      interest, 
      roomType,
      messPlan,
      visitDate,
      tourType,
      message,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: "Registration inquiry confirmed. Our team will contact you within 2 business hours.",
      inquiryId 
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
