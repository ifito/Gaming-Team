const { platformMap } = require('../constans');
const Game = require('../models/Game');

exports.getAll = () => Game.find({}).lean();

exports.getOne = (gameId) => Game.findById(gameId).lean();

exports.search = async (name, platform) => {
    let game = await this.getAll();

    if (name) {
        game = game.filter(x => x.name.toLowerCase() == name.toLowerCase());
    }

    if (platform) {
        game = game.filter(x => x.platform == platform);
    }

    return game;
};

exports.buy = async (userId, gameId) => {
    const game = await Game.findById(gameId);

    // TODO: check if user has already bought the game

    game.buyers.push(userId);

    return game.save(); // => koeto otiva v baza danni se await, a koeto se zapametqva v pametta ne se await
}
// Game.findByIdAndUpdate(gameId, { $push: { buyers: userId } });

exports.create = (ownerId, gameData) => Game.create({ ...gameData, owner: ownerId });

exports.edit = (gameId, gameData) => Game.findByIdAndUpdate(gameId, gameData, {runValidators: true});

exports.delete = (gameId) => Game.findByIdAndDelete(gameId);