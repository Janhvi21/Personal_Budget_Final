const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server');
const API = 'http://localhost:3000';

describe('GET /allUsers', () => {
    it('OK,creating a new user', (done) => {
        request(API).get('/allUsers').send().then((res) => {
            expect(res);
            done();
        })
    })
})