'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});

//review this...
describe('Noteful App', function () {

  let server;
  before(function () {
    return app.startServer()
      .then(instance => server = instance);
  });

  after(function () {
    return server.stopServer();
  });


  describe('Express static', function () {

    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });

  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/bad/path')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('GET /api/notes', function () {

    it('should return default of 10 notes', function() {
      return chai.request(app)
        .get('/api/notes')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
        });
    });
    //more tests here...
    it('should return a list with the correct right fields', function () {
      return chai.request(server)
        .get('/api/notes')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'content');
          });
        });
    });

    it('should return correct search results for a valid query', function () {
      return chai.request(server)
        .get('/api/notes?searchTerm=about%20cats')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(4);
          expect(res.body[0]).to.be.an('object');
        });
    });

    it('should return an empty array for an incorrect query', function () {
      return chai.request(server)
        .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
        });
    });

  });

  describe('GET /api/notes/:id', function () {
    it('should return note with specified id', function() {
      return chai.request(app)
        .get('/api/notes/1001')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(1001);
          expect(res.body.title).to.equal("What the government doesn't want you to know about cats");
        });
    });
    //FIGURE OUT WHY 404 IS FAILING
    it('should respond with 404 for invalid id', function () {
      return chai.request(app)
        .get('/api/notes/1646')
        .catch(err => err.response)
        .then(function (res) {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('POST /api/notes', function() {
    it('should create and return a new note when data is valid', function () {
      const newNote = {
        title: 'New note about cats',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum nunc a semper dignissim.',
      };
      return chai.request(app)
        .post('/api/notes')
        .send(newNote)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.id).to.equal(1010);
          expect(res.body.title).to.equal(newNote.title);
          expect(res.body.content).to.equal(newNote.content);
        });
    });

    it('should return an error when missing \'title\' field', function() {
      const newNote = {
        id: 2018,
      };
      return chai.request(app)
        .post('/api/notes')
        .send(newNote)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing title in request body');
        });
    });
  });

  describe('PUT /api/notes/:id', function() {
    it('should update the note with specified id', function() {
      const updatedNote = {
        title: 'Updating note',
        content: 'Testing to see if note updated'
      };
      return chai.request(app)
        .put('/api/notes/1005')
        .send(updatedNote)
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');

          expect(res.body.id).to.equal(1005);
          expect(res.body.title).to.equal(updatedNote.title);
          expect(res.body.content).to.equal(updatedNote.content);
        });
    });

    it('should respond with a 404 for an invalid id', function() {
      const updatedNote = {
        title: 'Updating note',
        content: 'Testing to see if note updated'
      };
      return chai.request(app)
        .put('/api/notes/9999')
        .send(updatedNote)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

    //look
    it('should return an error when missing "title" field', function () {
      const updateItem = {
        'foo': 'bar'
      };
      return chai.request(server)
        .put('/api/notes/9999')
        .send(updateItem)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing title');
        });
    });

  });


  describe('DELETE  /api/notes/:id', function() {
    it('should delete an note by specified id', function() {
      return chai.request(app)
        .delete('/api/notes/1005')
        .then( function(res) {
          expect(res).to.have.status(204);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .delete('/api/notes/9999')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });
});
