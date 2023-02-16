const Player = require('../models/playersModel');

let clubData = [
  { id: "1", name: "Argentina" },
  { id: "2", name: "Saudi Arabia" },
  { id: "3", name: "Mexico" },
  { id: "4", name: "Poland" },
  { id: "5", name: "Qatar" },
  { id: "6", name: "Ecuador" },
  { id: "7", name: "Senegal" },
  { id: "8", name: "Netherlands" },
  { id: "9", name: "England" },
  { id: "10", name: "Iran" },
  { id: "11", name: "USA" },
  { id: "12", name: "Wales" },
  { id: "13", name: "France" },
  { id: "14", name: "Australia" },
  { id: "15", name: "DenMark" },
  { id: "16", name: "Tunisia" },
  { id: "17", name: "Spain" },
  { id: "18", name: "Costa Rica" },
  { id: "19", name: "Germany" },
  { id: "20", name: "Japan" },
  { id: "21", name: "Belgium" },
  { id: "22", name: "Canada" },
  { id: "23", name: "Morocco" },
  { id: "24", name: "Croatia" },
  { id: "25", name: "Brazil" },
  { id: "26", name: "Serbia" },
  { id: "27", name: "Switzerland" },
  { id: "28", name: "Cameroon" },
  { id: "29", name: "Portugal" },
  { id: "30", name: "Ghana" },
  { id: "31", name: "Uruguay" },
  { id: "32", name: "Korea Republic" },
];

let positionData = [
  { id: "1", name: "GK" },
  { id: "2", name: "CB" },
  { id: "3", name: "RB" },
  { id: "4", name: "LB" },
  { id: "5", name: "CM" },
  { id: "6", name: "CDM" },
  { id: "7", name: "CAM" },
  { id: "8", name: "RW" },
  { id: "9", name: "LW" },
  { id: "10", name: "CF" },
  { id: "10", name: "RF" },
  { id: "11", name: "LF" },
];

let isCaptainData = [
  { id: "1", name: "Is Captain", value: true },
  { id: "1", name: "Isn't Captain", value: false },
];

class playersController {
  players(req, res, next) {
    Player.find({})
      .then((players) => {
        res.render("players", {
          title: "players",
          players: players,
          clubs: clubData,
          positions: positionData,
          captain: isCaptainData,
        });
      })
      .catch(next);
  }

  playerDetails(req, res, next) {
    const playerId = req.params.id;
    if (!playerId) {
      return next(new Error("Player not found"));
    }
    Player.findById(playerId)
      .then((player) => {
        res.render("playerDetails", {
          title: "Player Details",
          player: player,
        });
      })
      .catch(next);
  }

  create(req, res, next) {
    Player.create(req.body)
      .then((player) => {
        res.redirect("/players");
      })
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .send({ success: false, message: "Fail to create nation" });
      });
  }

  formEdit(req, res, next) {
    const playerId = req.params.id;
    Player.findById(playerId).then((player) => {
      res.json({
        player: {
          id: player._id,
          name: player.name,
          description: player.description,
          club: player.club,
          goals: player.goals,
          isCaptain: player.isCaptain,
          position: player.position,
          image: player.image,
          clubs: clubData,
          positions: positionData,
          captain: isCaptainData,
        },
      });
    });
  }

  update(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return next(new ErrorHandler("Not found players", 404));
    }
    Player.findByIdAndUpdate(id, req.body, { new: true })
      .then((player) => {
        res.redirect("/players");
      })
      .catch(next);
  }

  delete(req, res, next) {
    const player = Player.findById(req.params.id);
    if (!player) {
      return next(new ErrorHandler("Not found player", 404));
    }
    player.remove().then(() => {
      res.redirect("/players");
    });
  }
}

module.exports = new playersController;


