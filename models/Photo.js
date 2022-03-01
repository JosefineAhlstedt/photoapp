/**
 * Photo model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'photos'
	});
};
