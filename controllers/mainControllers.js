const Nation = require('../models/nationsModel');
const Player = require('../models/playersModel');

class mainController {
    main(req, res, next) {
        
        Promise.all([
            Nation.find({}).limit(4),
            Player.find({}).limit(4),
        ])
        .then(([nations, players]) => {
            res.locals.isAuthenticated = req.isAuthenticated();
            res.locals.user = req.user;
            res.render('main', {
                title: 'Home',
                nations: nations,
                players: players,
            });
        })
        .catch(next)
    };
};

module.exports = new mainController;