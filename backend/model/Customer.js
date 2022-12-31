import connection from "./database.js";
import util from "util";
let query = util.promisify(connection.query).bind(connection);

const Customer = {
  getPayment: ({ customer_id, start_date, end_date }) => {
    return query(
      'select film.title, payment.amount, DATE_FORMAT(payment.payment_date, "%Y-%m-%d %T") as payment_date\
      from payment\
      join rental on payment.rental_id=rental.rental_id\
      join inventory on rental.inventory_id = inventory.inventory_id\
      join film on film.film_id = inventory.film_id \
      where payment.customer_id=?\
      and payment.payment_date > ?\
      and payment.payment_date < ?',
      [customer_id, start_date, end_date]
    );
  },

  getPaymentAggregate: ({ customer_id, start_date, end_date }) => {
    return query(
      "select sum(payment.amount) as total\
      from payment\
      join rental on payment.rental_id=rental.rental_id\
      join inventory on rental.inventory_id = inventory.inventory_id\
      join film on film.film_id = inventory.film_id \
      where payment.customer_id=?\
      and payment.payment_date > ?\
      and payment.payment_date < ?",
      [customer_id, start_date, end_date]
    );
  },

  createAddress: ({
    address_line1,
    address_line2,
    district,
    city_id,
    postal_code,
    phone,
  }) => {
    return query(
      "INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [address_line1, address_line2, district, city_id, postal_code, phone]
    );
  },

  createCustomer: ({ first_name, last_name, store_id, email, address_id }) => {
    return query(
      "INSERT INTO customer (first_name, last_name, store_id, email, address_id) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, store_id, email, address_id]
    );
  },
};

export default Customer;
