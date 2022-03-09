/**
 * Photo model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'photos',
		//establishing one to many relationship
        user() {
			return this.belongsTo('User'); 
		},
		//establishing many to many relationship
		albums() {
			return this.belongsToMany('Album', 'photos_albums', 'photo_id', 'album_id');
		}
	});
};
