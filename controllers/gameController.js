const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const gameService = require('../services/gameService');
const { getErrorMessage } = require('../utils/errorUtils');
const { getPlatformViewData } = require('../utils/viewDataUtils');
//const { route } = require('./homeController');

router.get('/catalog', async (req, res) => {
    const game = await gameService.getAll(); // i tuk moje .lean() ako ne se sloji v gameService

    res.render('game/catalog', { game });
});

router.get('/search', async (req, res) => {
    const { name, platform } = req.query;
    const game = await gameService.search(name, platform);
    const platforms = getPlatformViewData(platform);

    res.render('game/search', { game, platforms, name });
});

router.get('/:gameId/details', async (req, res) => {
    const game = await gameService.getOne(req.params.gameId);

    const isOwner = game.owner == req.user?._id;
    const isBuyer = game.buyers?.some(id => id == req.user?._id);

    res.render('game/details', { game, isOwner, isBuyer });
});

router.get('/:gameId/buy', isAuth, async (req, res) => {
    try {
        await gameService.buy(req.user._id, req.params.gameId);
    } catch (error) {
        return res.status(400).render('404', { error: getErrorMessage(error) });
    }

    res.redirect(`/game/${req.params.gameId}/details`);
});

router.get('/:gameId/edit', isAuth, async (req, res) => {
    const game = await gameService.getOne(req.params.gameId);

    const platforms = getPlatformViewData(game.platform);

    res.render('game/edit', { game, platforms });
});

router.post('/:gameId/edit', isAuth, async (req, res) => {
    const gameData = req.body;
    await gameService.edit(req.params.gameId, gameData);

    // TODO: Check if owner

    res.redirect(`/game/${req.params.gameId}/details`);

});

router.get('/:gameId/delete', isAuth, async (req, res) => {
    await gameService.delete(req.params.gameId);

    // TODO: check if owner

    res.redirect('/game/catalog');
});

router.get('/create', isAuth, (req, res) => {
    res.render('game/create');
});

router.post('/create', isAuth, async (req, res) => {
    const gameData = req.body;

    try {
        await gameService.create(req.user._id, gameData);
    } catch (error) {
        return res.status(400).render('game/create', { error: getErrorMessage(error) });
    }

    res.redirect('/game/catalog');
});

module.exports = router;