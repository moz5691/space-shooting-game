class RestfulAPI {
  constructor(resourceName, app, model) {
    this.resource = resourceName;
    this.app = app;
    this.model = model;
  }

  find() {
    this.app.get(`/api/${this.resource}`, (req, res) => {
      this.model.find({})
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }

  create() {
    this.app.post(`/api/${this.resource}`, (req, res) => {
      this.model.create(req.body)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }



  findone(identifier) {
    console.log(`/api/${this.resource}/:${identifier}`);
    
    this.app.get(`/api/${this.resource}/:${identifier}`, (req, res) => {
      this.model.findOne({
          [identifier]: req.params[identifier]
      })
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err){
        res.json(err);
      })
    })
  }


}

module.exports = RestfulAPI;
