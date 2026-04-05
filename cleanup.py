from sqlmodel import create_engine, text

engine = create_engine("sqlite:///./taskflow.db")
with engine.connect() as conn:
    conn.execute(text("DELETE FROM project WHERE name IN ('Hacked!', 'Hacked by testuser!')"))
    conn.execute(text("DELETE FROM project WHERE name = 'Test User First Real Project'"))
    conn.commit()
    print("Done. Remaining projects:")
    projects = conn.execute(text("SELECT id, name, owner_id FROM project")).fetchall()
    for p in projects:
        print(f"  id={p[0]} | owner={p[2]} | {p[1]}")
