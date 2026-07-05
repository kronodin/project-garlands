from flask import Flask, jsonify, request, send_from_directory, abort
import sqlite3
import os
from pathlib import Path
from datetime import datetime

app = Flask(__name__, static_folder="static", static_url_path="/static")
BASE = Path(__file__).resolve().parent.parent
DATABASE = BASE / "files" / "app.db"
SITE_DIR = BASE
UPLOAD_DIR = BASE / "static" / "images"


def get_db():
    DATABASE.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            price REAL NOT NULL,
            unit TEXT,
            image TEXT,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS checkout_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            whatsapp TEXT,
            delivery TEXT,
            address TEXT,
            items TEXT,
            total REAL,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            whatsapp TEXT,
            email TEXT,
            address TEXT,
            business TEXT,
            last_order_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS bulletins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            starts_at TIMESTAMP,
            ends_at TIMESTAMP,
            sticky INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    # Migrate legacy schema if needed
    try:
        conn.execute("ALTER TABLE checkout_orders ADD COLUMN status TEXT DEFAULT 'new'")
    except Exception:
        pass
    conn.commit()
    conn.close()


@app.route("/api/products")
def api_products():
    category = request.args.get("category")
    search = request.args.get("search", "").lower()
    conn = get_db()
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    if category:
        query += " AND category = ?"
        params.append(category)
    if search:
        query += " AND lower(name) LIKE ?"
        params.append(f"%{search}%")
    query += " ORDER BY category, name"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/checkout", methods=["POST"])
def api_checkout():
    data = request.get_json(force=True, silent=True) or {}
    name = data.get("name")
    whatsapp = data.get("whatsapp")
    delivery = data.get("delivery")
    address = data.get("address")
    items = data.get("items", [])
    total = data.get("total", 0)
    if not name or not whatsapp or not address:
        return jsonify({"ok": False, "error": "missing fields"}), 400
    conn = get_db()
    conn.execute(
        "INSERT INTO checkout_orders (name, whatsapp, delivery, address, items, total) VALUES (?, ?, ?, ?, ?, ?)",
        (name, whatsapp, delivery, address, str(items), total),
    )
    conn.execute(
        "INSERT INTO customers (name, whatsapp, address, last_order_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(whatsapp) DO UPDATE SET name=excluded.name, address=excluded.address, last_order_at=CURRENT_TIMESTAMP",
        (name, whatsapp, address),
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/api/upload", methods=["POST"])
def api_upload():
    if "file" not in request.files:
        return jsonify({"ok": False, "error": "no file"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"ok": False, "error": "empty filename"}), 400
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = UPLOAD_DIR / f.filename
    f.save(dest)
    return jsonify({"ok": True, "path": f"/static/images/{f.filename}"})


@app.route("/images/<path:name>")
def serve_images(name):
    return send_from_directory(UPLOAD_DIR, name)


@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def serve_site(path):
    safe = (SITE_DIR / path).resolve()
    if str(safe).startswith(str(SITE_DIR.resolve())) and safe.is_file():
        return send_from_directory(SITE_DIR, path)
    return send_from_directory(SITE_DIR, "index.html")


@app.route("/api/admin/orders")
def admin_orders():
    status = request.args.get("status")
    conn = get_db()
    query = "SELECT * FROM checkout_orders WHERE 1=1"
    params = []
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY created_at DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/admin/orders/<int:order_id>", methods=["PATCH"])
def admin_order_update(order_id):
    data = request.get_json(force=True, silent=True) or {}
    status = data.get("status")
    if status not in {"new", "confirmed", "processing", "delivered", "cancelled"}:
        return jsonify({"ok": False, "error": "invalid status"}), 400
    conn = get_db()
    conn.execute("UPDATE checkout_orders SET status=? WHERE id=?", (status, order_id))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/api/admin/customers")
def admin_customers():
    conn = get_db()
    rows = conn.execute("SELECT * FROM customers ORDER BY last_order_at DESC NULLS LAST, created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/bulletins")
def api_bulletins():
    now = datetime.utcnow().isoformat()
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM bulletins WHERE (starts_at IS NULL OR starts_at <= ?) AND (ends_at IS NULL OR ends_at >= ?) ORDER BY sticky DESC, created_at DESC",
        (now, now),
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/admin/bulletins", methods=["POST"])
def admin_bulletins_create():
    data = request.get_json(force=True, silent=True) or {}
    title = data.get("title", "").strip()
    body = data.get("body", "").strip()
    sticky = 1 if data.get("sticky") else 0
    starts_at = data.get("starts_at")
    ends_at = data.get("ends_at")
    if not title or not body:
        return jsonify({"ok": False, "error": "missing fields"}), 400
    conn = get_db()
    conn.execute(
        "INSERT INTO bulletins (title, body, starts_at, ends_at, sticky) VALUES (?, ?, ?, ?, ?)",
        (title, body, starts_at, ends_at, sticky),
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


@app.route("/api/admin/bulletins/<int:bulletin_id>", methods=["DELETE"])
def admin_bulletins_delete(bulletin_id):
    conn = get_db()
    conn.execute("DELETE FROM bulletins WHERE id = ?", (bulletin_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=7777, debug=False)
