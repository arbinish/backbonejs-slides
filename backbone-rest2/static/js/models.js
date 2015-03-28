var User = Backbone.Model.extend({
	urlRoot: "/api/user"
});

var Users = Backbone.Collection.extend({
	model: User,
	url: "/api/users",
	parse: function(data) {
		return data.objects;
	}
});