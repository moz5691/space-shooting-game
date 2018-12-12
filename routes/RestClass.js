/* eslint-disable */

class RestfulAPI {
  /**
   * @description class constractor
   * @param {*} resourceName
   * @param {*} app
   * @param {*} model
   */
  constructor(resourceName, app, model) {
    this.resource = resourceName;
    this.app = app;
    this.model = model;
  }

  /**
   * @description Make a get route for find all fields on db
   * @returns json of all fields
   */
  find() {
    this.app.get(`/api/${this.resource}`, (req, res) => {
      this.model
        .find({})
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }

  /**
   * @description Make a post route for add field on db
   * @returns json of new field
   */
  create() {
    this.app.post(`/api/${this.resource}`, (req, res) => {
      this.model
        .create(req.body)
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }

  /**
   * @description Make a get route for finding field by identifier on db
   * @returns json of selected field
   */
  findone(identifier) {
    this.app.get(`/api/${this.resource}/:${identifier}`, (req, res) => {
      this.model
        .findOne({
          [identifier]: req.params[identifier]
        })
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }
  /**
   * @description Make a PUT route for updating field on db
   * @returns json of updated field by addin 1 on the score
   */
  findOneAndUpdate(identifier) {
    this.app.put(`/api/${this.resource}/:${identifier}`, (req, res) => {
      this.model
        .findOneAndUpdate(
          {
            username: req.params[identifier]
          },
          { $inc: { score: 1 } }
        )
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.json(err);
        });
    });
  }

  /**
   * @description Make a DELETE route for deleting field from db
   * @returns success if delete field and error if couldn't
   */

  deleteOne() {
    this.app.delete(`/api/${this.resource}`, (req, res) => {
      const chosen = req.body.username;
      this.model
        .remove({ username: chosen })
        .then(() => {
          res.json({ success: "success" });
        })
        .catch(err => {
          res.json(err);
        });
    });
  }

}

module.exports = RestfulAPI;
