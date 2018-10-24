/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('POST /api/issues/{project} => object with issue data', function() {
        test('Every field filled in', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA'
                })
                .end(function(err, res) {
                    assert.property(res.body, 'issue_title');
                    assert.property(res.body, 'issue_text');
                    assert.property(res.body, 'created_by');
                    assert.property(res.body, 'assigned_to');
                    assert.property(res.body, 'status_text');
                    assert.property(res.body, 'created_on');
                    assert.property(res.body, 'updated_on');
                    assert.property(res.body, 'open');
                    assert.property(res.body, '_id');
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
                    assert.equal(res.body.assigned_to, 'Chai and Mocha');
                    assert.equal(res.body.status_text, 'In QA');
                    assert.equal(res.body.open, true);
                    //Delete created issue for testing
                    chai.request(server)
                        .delete('/api/issues/test')
                        .send({ _id: res.body._id })
                        .end((err, aRes) => {
                            console.log(`deleted ${res.body._id}`);
                            done();
                        });
                });
        });

        test('Required fields filled in', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'issue_title');
                    assert.property(res.body, 'issue_text');
                    assert.property(res.body, 'created_by');
                    assert.property(res.body, 'assigned_to');
                    assert.property(res.body, 'status_text');
                    assert.property(res.body, 'created_on');
                    assert.property(res.body, 'updated_on');
                    assert.property(res.body, 'open');
                    assert.property(res.body, '_id');
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(res.body.open, true);
                    assert.equal(
                        res.body.created_by,
                        'Functional Test - Required fields filled in'
                    );
                    assert.equal(res.body.assigned_to, '');
                    assert.equal(res.body.status_text, '');
                    //Delete created issue for testing
                    chai.request(server)
                        .delete('/api/issues/test')
                        .send({ _id: res.body._id })
                        .end((err, aRes) => {
                            console.log(`deleted ${res.body._id}`);
                            done();
                        });
                });
        });

        test('Missing required fields', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    created_by: 'Functional Test - Missing required fields'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'missing inputs');
                    //Delete created issue for testing
                    chai.request(server)
                        .delete('/api/issues/test')
                        .send({ _id: res.body._id })
                        .end((err, aRes) => console.log(`deleted ${res.body._id}`));
                    done();
                });
        });
    });

    suite('PUT /api/issues/{project} => text', function() {
        test('No body', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end((err, paRes) => {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: paRes.body._id
                        })
                        .end(function(err, res) {
                            assert.equal(res.status, 400);
                            assert.equal(res.text, `"could not update ${paRes.body._id}"`);
                            //Delete issue created for test
                            chai.request(server)
                                .delete('/api/issues/test')
                                .send({ _id: paRes.body._id })
                                .end();
                            done();
                        });
                });
        });

        test('One field to update', function(done) {
            let now = Date.now();
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end((err, paRes) => {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: paRes.body._id,
                            issue_title: `Re-Titled: ${now}`
                        })
                        .end(function(err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, '"successfully updated"');
                            //Delete issue created for test
                            chai.request(server)
                                .delete('/api/issues/test')
                                .send({ _id: paRes.body._id })
                                .end();
                            done();
                        });
                });
        });

        test('Multiple fields to update', function(done) {
            let now = Date.now();
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end((err, paRes) => {
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: paRes.body._id,
                            issue_title: `Re-Titled: ${now}`,
                            created_by: `Re-created: ${now}`
                        })
                        .end(function(err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, '"successfully updated"');
                            //Delete issue created for test
                            chai.request(server)
                                .delete('/api/issues/test')
                                .send({ _id: paRes.body._id })
                                .end();
                            done();
                        });
                });
        });
    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
        test('No filter', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end((err, paRes) => {
                    chai.request(server)
                        .get('/api/issues/test')
                        .query({})
                        .end(function(err, res) {
                            assert.equal(res.status, 200);
                            assert.isArray(res.body);
                            assert.property(res.body[0], 'issue_title');
                            assert.property(res.body[0], 'issue_text');
                            assert.property(res.body[0], 'created_on');
                            assert.property(res.body[0], 'updated_on');
                            assert.property(res.body[0], 'created_by');
                            assert.property(res.body[0], 'assigned_to');
                            assert.property(res.body[0], 'open');
                            assert.property(res.body[0], 'status_text');
                            assert.property(res.body[0], '_id');
                            //Delete issue created for test
                            chai.request(server)
                                .delete('/api/issues/test')
                                .send({ _id: paRes.body._id })
                                .end();
                            done();
                        });
                });
        });

        test('One filter', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end((err, paRes) => {
                    chai.request(server)
                        .get('/api/issues/test')
                        .query({ open: true })
                        .end(function(err, res) {
                            assert.equal(res.status, 200);
                            assert.isArray(res.body);
                            assert.property(res.body[0], 'issue_title');
                            assert.property(res.body[0], 'issue_text');
                            assert.property(res.body[0], 'created_on');
                            assert.property(res.body[0], 'updated_on');
                            assert.property(res.body[0], 'created_by');
                            assert.property(res.body[0], 'assigned_to');
                            assert.property(res.body[0], 'open');
                            assert.property(res.body[0], 'status_text');
                            assert.property(res.body[0], '_id');
                            //Delete issue created for test
                            chai.request(server)
                                .delete('/api/issues/test')
                                .send({ _id: paRes.body._id })
                                .end();
                            done();
                        });
                });
        });

        test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in'
                })
                .end((err, paRes) => {
                    chai.request(server)
                        .get('/api/issues/test')
                        .query({ open: true })
                        .end(function(err, res) {
                            assert.equal(res.status, 200);
                            assert.isArray(res.body);
                            assert.property(res.body[0], 'issue_title');
                            assert.property(res.body[0], 'issue_text');
                            assert.property(res.body[0], 'created_on');
                            assert.property(res.body[0], 'updated_on');
                            assert.property(res.body[0], 'created_by');
                            assert.property(res.body[0], 'assigned_to');
                            assert.property(res.body[0], 'open');
                            assert.property(res.body[0], 'status_text');
                            assert.property(res.body[0], '_id');
                            //Delete issue created for test
                            chai.request(server)
                                .delete('/api/issues/test')
                                .send({ _id: paRes.body._id })
                                .end();
                            done();
                        });
                });
        });
    });
    suite('DELETE /api/issues/{project} => text', function() {
        test('No _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .end(function(err, res) {
                    assert.equal(res.status, 400);
                    assert.equal(res.text, '"_id error"');
                    done();
                });
        });
        test('Valid _id', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'DELETE title',
                    issue_text: 'I will be deleted',
                    created_by: 'Someone'
                })
                .end((err, parRes) => {
                    chai.request(server)
                        .delete('/api/issues/test')
                        .send({ _id: parRes.body._id })
                        .end(function(err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, `"deleted ${parRes.body._id}"`);
                            done();
                        });
                });
        });
    });
});
