const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    if (!request.body.text && !request.body.media.url) {
        response.status(400).json();
        return;
    }

    // Endpoint to create a new post
    PostModel.create(
        {
        "userId": request.currentUser.id,
        "text": request.body.text,
        "media": request.body.media
        }, callback => {
            console.log(callback);
    });
    response.json([]);
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    let postId = request.params.postId;

    PostModel.like(request.currentUser.id, postId, callback => {
        console.log(callback);

    });
    response.json([])


});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    let postId = request.params.postId;

    PostModel.unlike(request.currentUser.id, postId, callback => {
        console.log(callback);

    });
    response.json([])


});

module.exports = router;
