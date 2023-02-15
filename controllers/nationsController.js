const Nation = require("../models/nationsModel");
const ErrorHandler = require("../middelware/error");

class nationController {
  nations(req, res, next) {
    Nation.find({})
      .then((nations) => {
        res.render("nations", {
          title: "Nations",
          nations: nations,
        });
      })
      .catch(next);
  }

  nationDetail(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return next(new Error("Nation not found"));
    }
    Nation.findById(id)
    .then((nation) => {
      res.status(200).json({
        nation: nation
      })
    })
    .catch(next)
  }

  create(req, res, next) {
    const { name, description, image } = req.body;
    Nation.create({ name, description, image })
      .then((nation) => {
        res.redirect('/nations')
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ success: false, message: "Fail to create nation" });
      });
  }

  formEdit(req, res, next) {
    const nationId = req.params.id;
    Nation.findById(nationId)
    .then((nation) => {
      res.json({
        nation: {
          id: nation._id,
          name: nation.name,
          description: nation.description,
          image: nation.image
        }
      });
    })
  }

  update(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return next(new ErrorHandler("Not found nation", 404));
    }
    Nation.findByIdAndUpdate(id, req.body, { new: true })
      .then((nation) => {
        res.redirect('/nations')
      })
      .catch(next);
  }

  delete(req, res, next) {
    const nation = Nation.findById(req.params.id);
    if (!nation) {
      return next(new ErrorHandler("Not found nation", 404));
    }
    nation.remove().then(() => {
      res.redirect('/nations')
    });
  }
}

module.exports = new nationController();
