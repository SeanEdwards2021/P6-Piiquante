const Sauce = require('../models/Sauce');
const fs = require('fs');

// CREATE A SAUCE
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  delete sauceObject._id;
  const sauce = new Sauce ({
    ...sauceObject,
    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json ({
        message : "Sauce created successfully!"
      });
    }
  ).catch(
    error => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// MODIFY SAUCE
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,() => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          }
          Sauce.updateOne(
            {_id: req.params.id}, 
            {...sauceObject, _id: req.params.id}
          ).then(
            () => {
              res.status(200).json({
                message: 'Sauce modified!'
              });
            }
          ).catch(
            error => {
              res.status(400).json({
                error: error
              });
            }
          );
        });
      }
    ).catch(error => {
      res.status(500).json({
        error: error
      });
    });
  } else {
    const sauceObject = {...req.body};
    Sauce.updateOne(
      {_id: req.params.id}, 
      {...sauceObject, _id: req.params.id}
    ).then(() => {
      res.status(200).json({
        message: 'Sauce modified!'
      });
    }
  ).catch(
    error => {
      res.status(400).json({
        error: error
      });
    });
  };
};

// DELETE SAUCE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`,() => { 
      Sauce.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({
            message: 'Sauce deleted!'
          });
        }
      ).catch(
        error => {
          res.status(400).json({
            error: error
          });
        }
      ); 
    });
  }).catch(
    error => {
      res.status(500).json({
        error: error
      });
    }
  );
};

// GET ONE SAUCE
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne(
    {_id: req.params.id}
  ).then(
    (sauce) => {
      res.status(200).json(
        sauce
      )
    }
  ).catch(
    error => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// GET ALL SAUCES
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(
        sauces
      )
    }
  ).catch(
    error => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//LIKE/DISLIKE SAUCE
exports.likeDislikeSauce = async (req, res, next) => {
  let idSauce = await Sauce.findById(req.params.id);

  if (req.body.like === 1 && !idSauce.usersLiked.includes(req.body.userId)) { //if like = 1 and userId is not in userLiked array 
    idSauce.usersLiked.push(req.body.userId); // push userId in the array
    idSauce.likes++; // add 1 like
  } else if (req.body.like === 1 && idSauce.usersLiked.includes(req.body.userId)) { // if the userId is already in userLiked array send message
    res.status(201).json({
      message: 'You have already liked this sauce!'
    });
  }

  if (req.body.like === -1 && !idSauce.usersDisliked.includes(req.body.userId)) { // if like -1 and userId is not in userDisliked array
    idSauce.usersDisliked.push(req.body.userId); // push userId in the array
    idSauce.dislikes++; // add 1 dislike
  } else if (req.body.like === -1 && idSauce.usersDisliked.includes(req.body.userId)) { // if the userId is already in userDislike array send message
    res.status(201).json({
      message: 'You have already disliked this sauce!'
    });
  }

  if (req.body.like === 0 && idSauce.usersLiked.includes(req.body.userId)) { // if like = 0 and userId is in userLiked
    idSauce.usersLiked.remove(req.body.userId); // remove userId from the array
    idSauce.likes--; //remove 1 like
  } else if (req.body.like === 0 && idSauce.usersDisliked.includes(req.body.userId)) { // if like = 0 and userId is in userDisliked
    idSauce.usersDisliked.remove(req.body.userId); // remove userId from the array
    idSauce.dislikes--; // remove 1 dislike
  }
  idSauce.save().then(
    () => {
      res.status(201).json({
        message: 'Preference updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

















