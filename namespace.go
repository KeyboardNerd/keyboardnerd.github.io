var (
	cache *namespaceCache
	db    *sql.DB
)

/*
id SERIAL PRIMARY KEY,
name TEXT NULL,
version_format TEXT,
UNIQUE (name, version_format));
*/

func init() {
	cache = newCache(50)
}

func Register(b *sql.DB) {
	db = b
}

func GetID(n database.Namespace) (int, bool, error) {
	if id, ok := cache.Get(n); ok {
		return id, ok, nil
	}

	var id int
	if err := db.QueryRow(
		`SELECT id FROM namespace WHERE name = $1 AND version_format = $2;`,
		n.Name,
		n.VersionFormat,
	).Scan(&id); err != nil {
		if err == sql.ErrNoRows {
			return -1, false, nil
		}

		return -1, false, err
	}

	cache.Add(n, id)
	return id, true, nil
}

func Get(id int) (database.Namespace, bool, error) {
	if v, ok := cache.GetValue(id); ok {
		return v, ok, nil
	}

	var v database.Namespace
	if err := db.QueryRow(
		`SELECT name, version_format FROM namespace WHERE id = $1`,
		id,
	).Scan(v.Name, v.VersionFormat); err != nil {
		if err == sql.ErrNoRows {
			return v, false, nil
		}

		return v, false, err
	}

	cache.Add(v, id)
	return v, true, nil
}

func Add(n database.Namespace) (int, error) {
	id, ok, err := GetID(n)
	if err != nil || ok {
		return id, err
	}

	err = db.QueryRow(
		`INSERT INTO namespace (name, version_format) VALUES ($1, $2);
		 RETURNING id`,
		n.Name,
		n.VersionFormat,
	).Scan(id)

	if err != nil {
		// race condition.
		id, ok, err = GetID(n)
		if err != nil {
			return id, err
		}

		if !ok {
			panic("wtf")
		}
	}

	return id, err
}
