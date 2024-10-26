import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  // protect against sql injection
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}
