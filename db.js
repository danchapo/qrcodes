const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(\`
    CREATE TABLE IF NOT EXISTS pdfs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      cliente TEXT,
      filename TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  \`);
});

function insertPDF(nombre, cliente, filename) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO pdfs (nombre, cliente, filename) VALUES (?, ?, ?)");
    stmt.run(nombre, cliente, filename, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

function getAllPDFs() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM pdfs ORDER BY id DESC", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getPDFById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM pdfs WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = { insertPDF, getAllPDFs, getPDFById };
