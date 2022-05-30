const users = [];

const addUser = ({ id, room, userId }) => {
	const existUser = users.find(
		(user) => user.room === room && user.user === user
	);

	if (existUser) {
		return { error: "Username is taken" };
	}

	const user = { id, room, userId };

	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => users.find((user) => user.id === id);

module.exports = {
	addUser,
	removeUser,
	getUser,
};
