/**
 * Album model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'albums',
        //establishing one to many relationship
        user() {
			return this.belongsTo('User');
		},
        //establishing many to many relationship
        photos() {
			return this.belongsToMany('Photo', 'photos_albums', 'album_id', 'photo_id');
		}
	});
};