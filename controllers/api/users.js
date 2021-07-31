const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const create = async(req, res) => {
    try {
        console.log('hit create')
        const user = await User.create(req.body);
        console.log('user created')
        const token = createJWT(user);
        res.json(token);
        console.log('token created and jsoned')
    } catch(err) {
        res.status(400).json(err);
    }
}

const login = async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) throw new Error();
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
			const token = createJWT(user);
			res.json(token);
		} else {
			res.status(400).json('Bad Credentials');
		}
    } catch {
        res.status(400).json('Bad credentials');
    }
}

const show = async (req, res) => {
    try {
      console.log("before show");
      const user = await User.findById(req.params.id);
      console.log("after show");
      res.json(user);
    } catch {
      console.log("failed to execute show function");
      res.status(400);
    }
  };

const createJWT = (user) => {
    return jwt.sign (
        {user},
        process.env.SECRET,
        {expiresIn:'24h'}
    );
}

const checkToken = (req, res) => {
    console.log('req.user', req.user);
    res.json(req.exp);
}

module.exports = {
    create,
    login,
    checkToken,
    show
}