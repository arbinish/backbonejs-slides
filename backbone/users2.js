var _users = [{name: "peter", id: 1, department: "marketing"},
             {name: "charlie", id: 2, department: "research"},
             {name: "megan", id: 3, department: "sales"},
             {name: "florence", id: 4, department: "hr"}];

var User = Backbone.Model.extend({});

var Users = Backbone.Collection.extend({
	model: User
});

var users = new Users();

users.add(_users);

var UserView = Backbone.View.extend({
	initialize: function(edit) {
//		console.log("init userview", edit);
		this.edit = false;
		if (edit) {
			this.edit = true;
		}
	},
	events: {
		"change input[role=name]": "updateName",
		"change input[role=department]": "updateDepartment"
	},
	updateName: function(evt) {
		console.log("updating name", this.model.get("name"), "->", evt.target.value);
		this.model.set("name", evt.target.value);
	},
	updateDepartment: function(evt) {
		this.model.set("department", evt.target.value);
	},
	className: "row",
	tagName: "div",
	template: _.template('<input type="text" role="name" class="col-md-2 btn" value="<%= model.get(\"name\") %>"/><input type="text" role="department" class="col-md-2 btn" value="<%= model.get(\"department\") %>"/><% if (this.edit) {%><a class="col-md-1 btn btn-primary" href="#edit/<%= model.id %>">Edit</a><%}%>'),
	render: function() {
//		console.log("userview", this.model);
		this.$el.html(this.template({model: this.model}));
		return this;
	}
});

var AddUserView = Backbone.View.extend({
	className: "row",
	events: {
		"click button": "addUser"
	},
	addUser: function() {
		console.log("addUser clicked");
		var user = prompt("enter username");
		var dept = prompt("enter department");
		users.add(new User({name: user, department: dept, id: users.length+1}));
	},
	template: _.template('<button type="button" action="add" class="col-md-1 btn btn-primary">Add User</button>'),
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});

var HomeView = Backbone.View.extend({
	className: "row",
	tagName: "div",	
	initialize: function() {
		this.listenTo(this.collection, 'add', this.render);
	},
	render: function() {
		var self = this;
		this.$el.html((new AddUserView).render().el);
		this.collection.forEach(function(model) {
			self.$el.append(new UserView({model: model, edit: true}).render().el);
		});
		return this;
	}
});

var Router = Backbone.Router.extend({
	routes: {
		"": "home",
		"edit/:id": "edit"
	},
	initialize: function() {
		this.root = document.querySelector('#content');
	},
	edit: function(id) {
		var u = users.get(id);
		this.root.innerHTML = null;
		this.root.appendChild(new UserView({model: u, edit: false}).render().el);
	},
	home: function() {
		var homeView = new HomeView({collection: users});		
		this.root.innerHTML = null;
		this.root.appendChild(homeView.render().el);		
	}
});

var router = new Router();
Backbone.history.start();
