const pgdb = require('../util/posgre-database');

const Account = {};

Account.create = (data) => {
  const bindings = [...data];
  const SQL_CREATE_ACCOUNT = `INSERT INTO CUENTA(DESCRIPCION, CUENTA_TIPO, MONEDA, USUARIO)
                              VALUES($1, $2, $3, $4)`;
  return pgdb.query(SQL_CREATE_ACCOUNT, bindings);
}

Account.findById = (data) => {
  const bindings = [...data];
  const SQL_SELECT_ACCOUNT = `SELECT 
                                C.CUENTA AS "account",
                                C.DESCRIPCION AS "description",
                                TO_CHAR(C.ADD_FECHA, 'DD-MM-YYYY') AS "add_date",
                                CT.CUENTA_TIPO AS "account_type",
                                CT.DESCRIPCION AS "account_description",
                                M.MONEDA AS "currency",
                                M.DESCRIPCION AS "currency_description"
                              FROM CUENTA C
                                INNER JOIN CUENTA_TIPO CT ON (C.CUENTA_TIPO = CT.CUENTA_TIPO)
                                INNER JOIN MONEDA M ON (C.MONEDA = M.MONEDA)
                              WHERE C.CUENTA = $1 AND C.USUARIO = $2`;
  return pgdb.query(SQL_SELECT_ACCOUNT, bindings);
}

Account.fetchAll = (data) => {
  const bindings = [...data];
  const SQL_SELECT_ACCOUNTS = `SELECT 
                                  C.CUENTA AS "account",
                                  C.DESCRIPCION AS "description",
                                  TO_CHAR(C.ADD_FECHA, 'DD-MM-YYYY') AS "add_date",
                                  CT.CUENTA_TIPO AS "account_type",
                                  CT.DESCRIPCION AS "account_description",
                                  M.MONEDA AS "currency",
                                  M.DESCRIPCION AS "currency_description"
                                FROM CUENTA C
                                  INNER JOIN CUENTA_TIPO CT ON (C.CUENTA_TIPO = CT.CUENTA_TIPO)
                                  INNER JOIN MONEDA M ON (C.MONEDA = M.MONEDA)
                                WHERE C.USUARIO = $1`;
  return pgdb.query(SQL_SELECT_ACCOUNTS, bindings);
}

module.exports = Account;