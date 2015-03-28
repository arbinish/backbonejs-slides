var users = new Users();

var Router = Backbone.Router.extend({
	routes: {
		"": "home",
		"edit/:id": "edit"
	},
	initialize: function() {
		this.root = $('#content');
	},
	edit: function(id) {
		var u = new User({id: id}),
			self = this;
		u.fetch().success(function(){
			self.root.html(new UserView({model: u, edit: false}).render().el);	
		});		
	},
	home: function() {
		var self = this;
		users.fetch().success(function(data) {
			var homeView = new HomeView({collection: users});		
			self.root.html(homeView.render().el);			
		});		
	}
});

var router = new Router();
Backbone.history.start();
