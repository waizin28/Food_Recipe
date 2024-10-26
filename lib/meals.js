import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';

const db = sql('meals.db');

export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  // protect against sql injection
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  // sanitize and clean instructions because we are showing them as html
  meal.instructions = xss(meal.instructions);

  // storing images at the file system -> public folder
  const extension = meal.image.name.split('.').pop(); // get the file extension
  const fileName = `${meal.slug}.${extension}`;

  // using api provided by node.js
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer(); // output array buffer
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('saving image failed');
    }
  }); //need just buffer

  // storing overall data to database
  // storing image path
  meal.image = `/images/${fileName}`;
  db.prepare(
    `
  INSERT INTO meals
    (title, summary, instructions, creator, creator_email, image, slug)
  VALUES (
    @title,
    @summary,
    @instructions,
    @creator,
    @creator_email,
    @image,
    @slug
  )`
  ).run(meal);
}
