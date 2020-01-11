const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const db = require('../models');
const expect = chai.expect;

chai.use(chaiHttp);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsNotes";

let request;

descibe('GET /api/articles', () => {
    beforeEach(() => {
        request = chai.request(server);
        return mongoose.connect(MONGODB_URI);
    });

    it('should return an array of articles', (done) => {
        
    })
})