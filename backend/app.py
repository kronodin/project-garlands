from flask import Flask, jsonify, request, send_from_directory, abort
import sqlite3
import os
from pathlib import Path

app = Flask(__name__, static_folder="../static", static_url_path="/static")
BASE = Path(__file__).resolve().parent.parent
DATABASE = BASE / "files" / "app.db"
UPLOAD_DIR = BASE / "static" / "images"


def get_db():
    DATABASE.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            price REAL NOT NULL,
            unit TEXT,
            image TEXT,
            description TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS checkout_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            whatsapp TEXT,
            delivery TEXT,
            address TEXT,
            items TEXT,
            total REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    if conn.execute("SELECT count(*) FROM products").fetchone()[0] == 0:
        products = [
            ("Jasmine Rice (25kg)", "rice", 34.00, "bag", "rice-25kg.jpg", "Premium long grain"),
            ("Parboiled Rice (50kg)", "rice", 62.00, "bag", None, "Popular wholesale pack"),
            ("All-Purpose Flour (25kg)", "flour", 21.00, "bag", None, "Bakery and household"),
            ("Whole Wheat Flour (20kg)", "flour", 26.00, "bag", None, "Health food stores"),
            ("Granulated Sugar (20kg)", "pantry", 18.00, "bag", None, "Household bulk"),
            ("Brown Sugar (10kg)", "pantry", 16.00, "bag", None, "Bakery grade"),
            ("Red Kidney Beans (25kg)", "canned", 30.00, "bag", None, "Rice and peas staple"),
            ("Gungo Peas (25lb)", "canned", 22.00, "bag", None, "Soup and stew"),
            ("Canned Mackerel (half case)", "canned", 48.00, "half-case", None, "Tinned fish"),
            ("Corned Beef (half case)", "canned", 54.00, "half-case", None, "Quick meal stock"),
            ("Pasta Spaghetti (20kg)", "canned", 27.00, "bag", None, "Restaurant pack"),
            ("Cooking Oil (20L)", "oils", 38.00, "tin", None, "Frying and seasoning"),
            ("Margarine (5kg)", "oils", 18.00, "tub", None, "Bakery / household"),
            ("Soy Sauce (1 gallon)", "oils", 14.00, "bottle", None, "Food service"),
            ("White Vinegar (1 gallon)", "oils", 10.00, "bottle", None, "Pickling / cleaning"),
            ("Orange Juice (24x1L)", "beverages", 42.00, "case", None, "Retail multipack"),
            ("Sparkling Water (24x330ml)", "beverages", 32.00, "case", None, "Cooler stock"),
            ("Energy Drink (24x500ml)", "beverages", 56.00, "case", None, "High turnover"),
            ("Laundry Detergent (10L)", "household", 29.00, "bottle", None, "Hotel / institution"),
            ("Fabric Softener (4L)", "household", 16.00, "bottle", None, "Household"),
            ("Dishwashing Liquid (5L)", "household", 12.00, "bottle", None, "Kitchen pack"),
            ("Bin Liners (100pcs)", "household", 11.00, "roll", None, "Bulk essential"),
            ("Paper Towels (12 pack)", "household", 17.00, "pack", None, "Commercial use"),
            ("Bleach (4L)", "household", 13.00, "bottle", None, "Cleaning"),
            ("Toothpaste (12 pack)", "personal-care", 21.00, "pack", None, "Family pack"),
            ("Body Lotion (12x400ml)", "personal-care", 33.00, "case", None, "Promo pack"),
            ("Deodorant (24 pack)", "personal-care", 38.00, "pack", None, "Retail ready"),
            ("Disposable Cups (1000pcs)", "household", 24.00, "pack", None, "Café / shop"),
            ("Aluminum Foil (10 rolls)", "household", 19.00, "box", None, "Food service"),
            ("Trash Bags (50pcs)", "household", 15.00, "pack", None, "Large black"),
        ]
        conn.executemany(
            "INSERT INTO products (name, category, price, unit, image, description) VALUES (?, ?, ?, ?, ?, ?)",
            products,
        )
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


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=7777, debug=False)
