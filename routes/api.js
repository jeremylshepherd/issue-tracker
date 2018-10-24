/*
*
*
*       Complete the API routing below
*
*
*/
'use strict';
const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const IssueModel = require('../models/Issues');
const ProjectModel = require('../models/Projects');

module.exports = function(app) {
    const createIssue = (req, res, project) => {
        let obj = {
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            status_text: req.body.status.text,
            open: true,
            project: project._id
        };
        res.json(obj);
    };
    app.route('/api/issues/:project')
        .get(function(req, res) {
            let project = req.params.project.toLowerCase();
            ProjectModel.findOne({ project_name: project }, (err, result) => {
                let query = { ...req.query, project: result._id };
                IssueModel.find(query, (err, results) => {
                    res.json(results);
                });
            });
        })
        .post(function(req, res) {
            let project = req.params.project.toLowerCase();
            if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
                return res.send('missing inputs');
            }
            ProjectModel.findOne({ project_name: project }, (err, projectResult) => {
                if (err) return res.json({ message: `DB Error: ${err}` });
                if (!projectResult) {
                    let newProject = new ProjectModel({ project_name: project });
                    newProject.save((err, p) => {
                        let issue = new IssueModel({
                            issue_title: req.body.issue_title,
                            issue_text: req.body.issue_text,
                            created_by: req.body.created_by,
                            assigned_to: req.body.assigned_to || '',
                            status_text: req.body.status_text || '',
                            open: true,
                            project: p._id
                        });
                        issue.save((err, iss) => {
                            if (err) return res.json({ message: `DB Error: ${err}` });
                            res.json(iss);
                        });
                    });
                } else {
                    let issue = new IssueModel({
                        issue_title: req.body.issue_title,
                        issue_text: req.body.issue_text,
                        created_by: req.body.created_by,
                        assigned_to: req.body.assigned_to,
                        status_text: req.body.status_text,
                        open: true,
                        project: projectResult._id
                    });
                    issue.save((err, iss) => {
                        if (err) return res.json({ message: `DB Error: ${err}` });
                        res.json(iss);
                    });
                }
            });
        })

        .put(function(req, res) {
            let keys = Object.keys(req.body);
            if (!keys.length) return res.status(400).json(`could not update`);
            if (keys.length === 1 && keys[0] === '_id')
                return res.status(400).json(`could not update ${req.body._id}`);
            let update = {};
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] !== '_id' && req.body[keys[i]] !== '') {
                    update[keys[i]] = req.body[keys[i]];
                }
            }
            update.updated_on = Date.now();
            IssueModel.findOneAndUpdate(
                { _id: req.body._id },
                update,
                { new: true },
                (err, issue) => {
                    if (err) return res.json({ message: `DB Error: ${err}` });
                    res.json('successfully updated');
                }
            );
        })

        .delete(function(req, res) {
            let project = req.params.project;
            if (!req.body._id) return res.status(400).json('_id error');
            IssueModel.findOneAndRemove({ _id: req.body._id }, (err, issue) => {
                return res.json(`deleted ${req.body._id}`);
            });
        });
};
