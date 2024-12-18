"use strict";

let projects = [];
let issues = [];
let idCounter = 1;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const projectName = req.params.project;
      console.log("GET REQ PARAM:", projectName);
      console.log("GET REQ QUERY:", req.query);
      const sanitizedQuery = {};
      for (const key in req.query) {
        sanitizedQuery[key.trim()] = req.query[key];
      }
      const filteredArray = issues.filter((el) => {
        if (el.project !== projectName) {
          return false;
        }  
        for (const key in sanitizedQuery) {
          if (sanitizedQuery[key] && el[key] !== sanitizedQuery[key]) {
            return false; 
          }
        }
        return true;
      });
      console.log("FILTERED ARRAY:", filteredArray);
      res.json(filteredArray);
    })

    .post(function (req, res) {
      const project = req.params.project;
      console.log("POST REQ PARAM:", project);
      console.log("POST REQ BODY:", req.body);
      const issueTitle = req.body.issue_title;
      const issueText = req.body.issue_text;
      const createdBy = req.body.created_by;
      const createdOn = new Date();
      const createdOnString = createdOn.toISOString();
      console.log("CREATED ON:", createdOn);
      console.log("CREATED ON STRING:", createdOnString);
      const id = idCounter.toString();
      let updatedOn = "";
      let assignedTo = "";
      let open = true;
      if (req.body.assigned_to) {
        assignedTo = req.body.assigned_to;
      }
      let statusText = "";
      if (req.body.status_text) {
        statusText = req.body.status_text;
      }
      if (!issueTitle || !issueText || !createdBy) {
        console.log("ERROR: Required fields missing");
        return res.json({ error: "required field(s) missing" });
      } else {
          const response = {
            issue_title: issueTitle,
            issue_text: issueText,
            created_by: createdBy,
            assigned_to: assignedTo,
            status_text: statusText,
            created_on: createdOnString,
            _id: id,
            updated_on: updatedOn,
            open
          };
          res.json(response);
          console.log("RESPONSE:", response);
          issues.push({...response, project});
          idCounter++;
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log("PUT REQ PARAM:", project);
      console.log("PUT REQ BODY:", req.body);

      if (req.body && !req.body._id) {
        return res.json({ error: "missing _id" });
      }

      const { _id, issue_title, issue_text, created_by, status_text, open, assigned_to } = req.body;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (!issue_title && !issue_text && !created_by && !status_text && !open && !assigned_to) {
        return res.json({ error: "no update field(s) sent", _id });
      }

      const element = issues.find((el) => el._id === _id);

      if (!element) {
        return res.json({ error: "could not update", _id });
      }

      if (issue_title) element.issue_title = issue_title;
      if (issue_text) element.issue_text = issue_text;
      if (created_by) element.created_by = created_by;
      if (assigned_to) element.assigned_to = assigned_to;
      if (status_text) element.status_text = status_text;
      if (typeof open !== "undefined") element.open = open; 
      
      element.updated_on = new Date().toISOString();

      console.log({ result: "successfully updated", _id });
      return res.json({ result: "successfully updated", _id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      console.log("DELETE REQ BODY:", req.body);
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }  else if (!issues.find((el) => el._id === req.body._id)) {
          return res.json({ error: "could not delete", _id: req.body._id });
      }  else {
           const updatedArray = issues.filter(el => el._id !== req.body._id);
            issues = updatedArray;
            console.log({result: "successfully deleted", _id: req.body._id })
            return res.json({  result: "successfully deleted", _id: req.body._id })
      }
  });

  app.post("/api/:project", function (req, res) {
    const project = req.params.project;
    projects.push(project);
    res.status(200).json({result: `succesfully added ${project}`})
  });

};
