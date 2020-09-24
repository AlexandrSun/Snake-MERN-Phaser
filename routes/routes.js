const {Router} = require('express');
const Rating = require('../models/Rating');
const router = Router();

//   /api/register
router.post(
    '/register',
    async (req, res) => {

        try {
            const {name, id, score} = req.body;

            const addScore = await Rating.findOne({id});
            if (addScore) {
                await Rating.findOneAndUpdate(
                    {id},
                    { $set: {"score": addScore.score + score} },
                    { new: true });

                res.status(201).json({message: "Score updated successfully!"})
            } else {
                const user = new Rating({name, id, score});
                await user.save();

                res.status(201).json({message: "User created successfully!"})
            }

        } catch (e) {
            res.status(500).json({message: "Something went wrong, try again."})
        }
    }
);

//   /api/score
router.get(
    '/score',
    async (req, res) => {
        try {
            const score = await Rating.find()
                .sort({"score": -1});

            res.json(score)

        } catch (e) {
            res.status(500).json({message: "Something went wrong, try again."})
        }
    }
);

module.exports = router;
