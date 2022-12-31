import connection from "./database.js";
import util from "util";
let query = util.promisify(connection.query).bind(connection);

const Film = {
  getFilmsByCategoryId: ({ category_id }) => {
    return query(
      "SELECT film.film_id, film.title, category.name as category, film.rating, film.release_year, film.length as duration from film join film_category on film_category.film_id=film.film_id join category on category.category_id=film_category.category_id WHERE category.category_id =?;",
      [category_id]
    );
  },
};

export default Film;
