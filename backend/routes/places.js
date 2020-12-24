const express = require("express");
const placeController = require("../controllers/places");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post('', checkAuth,extractFile, placeController.createPlace);

router.put('/:id', checkAuth,extractFile, placeController.updatePlace);

router.get('', placeController.getPlaces);

router.get('/:id', placeController.getPlace);

router.delete('/:id', checkAuth, placeController.deletePlace);

module.exports = router;
