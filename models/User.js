/**
 * User model
 */

module.exports = (bookshelf) => {
	return bookshelf.model("User", {
		tableName: "users",
		//establishing one to many relationship
		photos() {
			return this.hasMany("Photo");
		},
		//establishing one to many relationship
		albums() {
			return this.hasMany("Album");
		},
	});
};
