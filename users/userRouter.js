const express = require('express');
const Users = require('./userDb.js')
const Posts = require('../posts/postRouter.js');

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const user = await Users.insert(req.body)
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the users' })
    }
});

router.post('/:id/posts', async(req, res) => {
    const postInfo = {...req.body, user_id: req.params.id }
    try {
        const post = await Posts.insert(postInfo);
        res.status(210).json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting the posts for the user'
        })
    }
});

router.get('/', async(req, res) => {
    try {
        const users = await Users.get(req.query);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the users' })
    }
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Users.getById(id)
        .then(user => {
            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(404).json({ message: "Cannot find the user" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'The user information could not be retrieved.' });
        });
}) 


router.get('/:id/posts', async(req, res) => {
    try {
        const posts = await Users.getUserPosts(req.params.id);

        res.status(200).json(posts);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error getting the posts for the user',
        });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const count = await Users.remove(req.params.id)
        if (count > 0) {
            res.status(200).json({ message: 'The user has been removed' })
        } else {
            res.status(404).json({ message: 'The user could not be found' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error removing the user' })
    }
});

router.put('/:id', async(req, res) => {
    try {
        const user = await Users.update(req.params.id, req.body)
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'The user could not be found' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating the user'
        })
    }
});

//custom middleware

function validateUserId(req, res, next) {

    const id = req.params.id;

    Users.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(400).json({ message: "Invalid User ID" });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
}


function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;