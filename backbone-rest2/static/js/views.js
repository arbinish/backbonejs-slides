var UserView = Backbone.View.extend({
	initialize: function(edit) {
		var self = this;
		this.listenTo(this.model, "change:name", this.save);
		this.listenTo(this.model, "change:department", this.save);
		this.edit = false;
		if (edit) {
			this.edit = true;
		}
	},
	save: function() {
		this.model.save({});
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
		console.log("updating department", this.model.get("department"), "->", evt.target.value);
		this.model.set("department", evt.target.value);
	},
	className: "row",
	tagName: "div",
	template: _.template('<input type="text" role="name" class="col-md-2 btn" value="<%= model.get(\"name\") %>"/><input type="text" role="department" class="col-md-2 btn" value="<%= model.get(\"department\") %>"/><% if (this.edit) {%><a class="col-md-1 btn btn-primary" href="#edit/<%= model.id %>">Edit</a><%}%>'),
	render: function() {	
		console.log("userview rendering");
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
		if (user === null) {
			return;
		}
		var dept = prompt("enter department");
		if (dept === null) {
			return;
		}
		var newUser = new User({name: user, department: dept});
		newUser.save({}).success(function(resp) {
			newUser.id = resp.id;
			console.log("newUser", newUser, newUser.toJSON());
			users.add(newUser);
		});
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
