/**
 * Photo model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'photos',
        user() {
			return this.belongsTo('User');   // books.author_id = 3   ->   authors.id = 3 (single author)
		},
		albums() {
			return this.belongsToMany('Album', 'photos_albums', 'photo_id', 'album_id');
			//return this.belongsToMany('Album', 'photo_album', 'album_id', 'photo_id');
		}
	});
};
