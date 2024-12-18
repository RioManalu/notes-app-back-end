class NotesHandler {
  constructor(service, validator) {
    // Penggunaan nama variabel diawali underscore (_) dipertimbangkan sebagai lingkup privat secara konvensi.
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { title = 'untitled', tags, body } = request.payload;
    const { id : credentialId } = request.auth.credentials; // ini

    const noteId = await this._service.addNote({ title, tags, body, owner:credentialId });
    const response = h.response({
      status : 'success',
      message : 'Catatan berhasil ditambahkan',
      data : {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler(request) {
    const { id : credentialId } = request.auth.credentials;
    const notes = await this._service.getNotes(credentialId);
    return {
      status : 'success',
      data : {
        notes,
      }
    }
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id : credentialId } = request.auth.credentials; // cek sama id sama ga?

    await this._service.verifyNoteAccess(id, credentialId);
    const note = await this._service.getNoteById(id);
    return {
      status : 'success',
      data : {
        note,
      },
    };
  }

  async putNoteByIdHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id : credentialId } = request.auth.credentials;
    // console.log('credentials auth', request.auth.credentials);

    await this._service.verifyNoteAccess(id, credentialId);
    await this._service.editNoteById(id, request.payload);

    return{
      status : 'success',
      message : 'Catatan berhasil diperbaharui',
    };
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id : credentialId } = request.auth.credentials;

    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deleteNoteById(id);

    return {
      status : 'success',
      message : 'Catatan berhasil dihapus',
    }
  }
}

module.exports = NotesHandler;