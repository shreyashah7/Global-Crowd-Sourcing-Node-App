var assert = require('assert');
var app = require('../app');
var request = require('supertest');
var agent = request.agent(app);
var assert = require('chai').assert;
var userId = '';
var updatedUserName = 'Test-Admin';
var projectName = 'Test-Project' + Math.random();
var email = "test" + Math.random() + '@gmail.com';

//---For removing the inserted data during the TestCase-----------

describe("Freelancer Test cases", function () {
    after((done) => { //After All the test we empty the database
        agent
            .delete('/user')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
    it('Test case 1 - Sign Up', function (done) {
        agent
            .put('/signup')
            .send({
                "email": email,
                "password": "Testing@123",
                "firstName": "admin",
                "lastName": "admin",
                "role": 1
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) done(err);
                assert.equal(res.body.data.email, email);
                done();
            });
    });
    it('Test case 2 - Employer Login', function (done) {
        agent
            .post('/login')
            .send({
                "email": email,
                "password": "Testing@123",
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) done(err);
                userId = res.body.data.id;
                assert.equal(res.body.data.email, email);
                done();
            });
    });
    it('Test case 3 - Get User Details', function (done) {
        agent
            .get('/user/' + userId)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) done(err);
                assert.equal(res.body.data.email, email);
                done();
            });
    });
    it('Test case 4 - Update User Information', function (done) {
        agent
            .put('/user/' + userId)
            .send({
                "id": userId,
                "firstName": updatedUserName
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) done(err);
                assert.equal(res.body.data.first_name, updatedUserName);
                done();
            });
    });
    it('Test case 5 - Post Project', function (done) {
        agent
            .post('/project')
            .send({
                "projectName": projectName,
                "description": "I am very good angular developer",
                "jobType": "HOURLY",
                "jobRate": "35",
                "skills": "Mobile App Development,NodeJS",
                "employer": userId
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) done(err);
                assert.equal(res.body.data.project_name, projectName);
                done();
            });
    });
})