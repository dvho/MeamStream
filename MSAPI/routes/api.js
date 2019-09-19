// Full Documentation - https://www.turbo360.co/docs
const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID });
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });
const router = vertex.router();


const validResources = ['message'];
const PAGE_LENGTH = 5;


router.get('/user', (req, res) => {
    const resource = 'user'
    const filter = req.query

    turbo.fetch(resource, filter)
    .then(data => {
        res.json({
            confirmation: 'success',
            data: data
        })
    })
    .catch(err => {
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })
})


router.post('/updateuser', (req, res) => {
    let obj

    if (req.body.type === 'image') {
        obj = {image: req.body.image.url}
    }
    if (req.body.type === 'pushToken') {
        obj = {pushToken: req.body.token.value}
    }
    if (req.body.type === 'filter') {
        obj = {filter: req.body.filter.messageId}
    }

    const resource = 'user'
    const userId = req.body.user.id

	turbo.updateEntity(resource, userId, obj)
	.then(data => {
		res.json({
			confirmation: 'success',
			data: data
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})


router.get('/user/:id', (req, res) => {
    const resource = 'user'
    const userId = req.params.id

    turbo.fetchOne(resource, userId)
    .then(data => {
        res.json({
            confirmation: 'success',
            data: data
        })
    })
    .catch(err => {
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })
});


router.post('/message',  (req, res) => {
  const toUser = req.body.toUser.toLowerCase();
  let params = req.body;

  turbo
    .fetch('user', { username: toUser })
    .then(data => {
      if (data.length === 0) {
        throw new Error('User not found');
      }
      params.toUser = data[0].id;
      return turbo.create('message', params);
    })
    .then(data => {
      res.json({
        confirmation: 'success',
        data: data
      });
      return;
    })
    .catch(err => {
      console.log(err);
      res.json({
        confirmation: 'fail',
        message: err.message
      });
      return;
    });
});


router.get('/:resource', (req, res) => {
  const { resource } = req.params;
  let { query } = req;

  if (validResources.indexOf(resource) < 0) {
    res.json({
      confirmation: 'fail',
      message: 'No such resource'
    });
    return;
  }

  const { page } = query;
  delete query.page;

  turbo
    .fetch(resource, query)
    .then(data => {
      const pageResults = data.slice(
        PAGE_LENGTH * page - PAGE_LENGTH,
        PAGE_LENGTH * page
      );
      //Must let front end know there are no more pages on last page
      res.json({
        confirmation: 'success',
        data: pageResults
      });
      return;
    })
    .catch(err => {
      console.log(err);
      res.json({
        confirmation: 'fail',
        message: err.message
      });
      return;
    });
});


router.get('/message/me', (req, res) => {
  const resource = 'message';
  const { query } = req;

  const messages = [];
  const first = {
    toUser: query.toUser,
    fromUser: query.fromUser
  };
  const second = {
    fromUser: query.toUser,
    toUser: query.fromUser
  };

  turbo
    .fetch(resource, first)
    .then(data => {
      data.forEach((mes, i) => {
        messages.push(mes);
      });
      return turbo.fetch(resource, second);
    })
    .then((data, i) => {
      data.forEach((mes, i) => {
        messages.push(mes);
      });
      res.json({
        confirmation: 'success',
        data: messages
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        confirmation: 'fail',
        message: err.message
      });
      return;
    });
});

module.exports = router;
