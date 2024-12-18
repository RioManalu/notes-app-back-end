const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const bcrypt = require('bcrypt');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class USersServices {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // Verifikasi username, pastikan belum terdaftar.
    await this.verifyNewUsername(username);

    // Bila verifikasi lolos, maka masukkan user baru ke database.
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password,10);
    const query = {
      text : 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values : [id, username, hashedPassword, fullname],
    }

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text : 'SELECT * FROM users WHERE username = $1',
      values : [username],
    }

    const result = await this._pool.query(query);
    if(result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async getUserById(id) {
    const query = {
      text : 'SELECT id, username, fullname FROM users WHERE id = $1',
      values : [id],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    // console.log('get user Id', result.rows[0]);
    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text : 'SELECT id, password FROM users WHERE username = $1',
      values : [username],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password : hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if(!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    // id ini nantinya digunakan untuk membuat access token dan refresh token
    return id;
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = USersServices;