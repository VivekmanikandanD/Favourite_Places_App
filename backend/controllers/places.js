const Place = require('../models/places');

exports.createPlace = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const place = new Place({
    name: req.body.name,
    description: req.body.description,
    address: req.body.address,
    imagePath: url + "/images/" + req.file.filename,
    createdBy: req.userData.userId
  });
  console.log(place);
  place.save().then(createdPlace => {
    res.status(201).json({
      message: "Place added successfully",
      place: {
        ...createdPlace,
        id: createdPlace._id,
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Place creation failed"
    });
  })
}

exports.updatePlace = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.file);
  let imagePath;
  if (req.file) {
    imagePath = url + "/images/" + req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }
  const place = new Place({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    address: req.body.address,
    imagePath: imagePath,
    createdBy: req.userData.userId
  });
  Place.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, place).then((result) => {
    console.log(result)
    if (result.n > 0) {
      res.status(200).json({ message: "Place updated successfully" });
    } else {
      res.status(401).json({ message: "You are unauthorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Place updation failed"
    });
  })
}

exports.getPlaces = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  let fetchedPlaceData;
  const placeQuery = Place.find();
  if (pageSize && currentPage) {
    placeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  placeQuery
    .then(documents => {
      console.log(documents)
      fetchedPlaceData = documents;
      return Place.estimatedDocumentCount()
    }).then((count) => {
      res.status(200).send({
        message: "Server processed your request successfully",
        places: fetchedPlaceData,
        totalPlaceCount: count
      });
    }).catch(error => {
      res.status(500).json({
        message: "Could not fetch places"
      });
    });
}

exports.getPlace = (req, res, next) => {
  Place.findOne({ _id: req.params.id })
    .then(place => {
      console.log(place)
      if (place) {
        res.status(200).json(place);
      } else {
        res.status(404).json({ message: "Place not found" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Could not fetch places"
      });
    });
}

exports.deletePlace = (req, res, next) => {
  Place.deleteOne({ _id: req.params.id, createdBy: req.userData.userId }).then(response => {
    console.log(response);
    if (response.n > 0) {
      res.status(200).json({ message: "Place Deleted successfully" });
    } else {
      res.status(401).json({ message: "You are unauthorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not delete place"
    });
  });
}
