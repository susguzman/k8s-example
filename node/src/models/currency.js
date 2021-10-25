const pgdb = require('../util/posgre-database');

const Currency = {};

Currency.create = (data) => {
  const bindings = [...data];
  const SQL_CREATE_CURRENCY = `INSERT INTO MONEDA(DESCRIPCION) VALUES ($1)`;
  return pgdb.query(SQL_CREATE_CURRENCY, bindings);
}

Currency.findById = (data) => {
  const bindings = [...data];
  const SQL_SELECT_CURRENCY = `SELECT
                                MONEDA AS "currency",
                                DESCRIPCION AS "description",
                                TO_CHAR(ADD_FECHA, 'DD-MM-YYYY') AS "add_date"
                              FROM MONEDA
                              WHERE MONEDA = $1`;
  return pgdb.query(SQL_SELECT_CURRENCY, bindings);
}

Currency.fetchAll = () => {
  const SQL_SELECT_CURRENCIES = `SELECT
                                  MONEDA AS "currency",
                                  DESCRIPCION AS "description",
                                  TO_CHAR(ADD_FECHA, 'DD-MM-YYYY') AS "add_date"
                                FROM MONEDA`;
  return pgdb.query(SQL_SELECT_CURRENCIES); 
}

module.exports = Currency;