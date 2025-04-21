const express = require("express");
const multer = require("multer");
const path = require("path");
const QRCode = require("qrcode");
const { insertPDF, getAllPDFs, getPDFById } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  const { nombre, cliente } = req.body;
  const filename = req.file.filename;
  const id = await insertPDF(nombre, cliente, filename);
  const url = `https://pdf-qr-app.onrender.com/pdflinks/${id}`;
  const qr = await QRCode.toDataURL(url);
  res.json({ id, url, qr });
});

app.get("/pdflinks/:id", async (req, res) => {
  const data = await getPDFById(req.params.id);
  if (!data) return res.status(404).send("No encontrado");
  res.redirect(`/uploads/${data.filename}`);
});

app.get("/all", async (req, res) => {
  const records = await getAllPDFs();
  res.json(records);
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
