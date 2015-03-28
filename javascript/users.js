var users = [{name: "peter", id: 1, department: "marketing"},
             {name: "charlie", id: 2, department: "research"},
             {name: "megan", id: 3, department: "sales"},
             {name: "florence", id: 4, department: "hr"}];

var root = document.querySelector("#content"),
	max = users.length,
	node = null;

function getUserEntry(entry, edit) {
	var node = document.createElement("div"),
		content = '<input type=text role="name" class="col-md-2 btn" value="' + entry.name + '"/>'
			+ '<input type="text" role="department" class="col-md-2 btn" value="' + entry.department + '"/>';
	if (edit === true) {
		content += '<button type="button" class="col-md-1 btn btn-primary" data-user-id="' + entry.id + '"/>Edit</button>';
	}
	node.className = "row";
	node.attributes["uid"] = entry.id;
	node.innerHTML = content;
	return node;
}


function editUser(user) {
	var back = document.createElement("button");
	back.className = "btn btn-primary";
	back.attributes.type = "button";
	back.innerText = "Back";
	
	root.innerHTML = null;
	root.appendChild(back);
	root.appendChild(getUserEntry(user));
}

function setupInputListener() {
	root.addEventListener("change", function(event) {
		
		var target = event.target,
			user = null,
			uid = null;
		if (target.nodeName !== "INPUT") {
			console.log(target.nodeName, "not an input element");
			return;
		}
		uid = target.parentNode.attributes["uid"];
		if (uid === null) {
			console.error("NO uid for user. This can't be happening!!!");
			return;
		}
		user = users.filter(function(d) {
			return d.id === parseInt(uid);
		});
		if (user.length == 0) {
			console.error("No such user found", uid);
			return;
		}
		user = user[0];
		var role = target.attributes["role"];
		if (role) {
			role = role.value;
		} else {
			console.error("cannot find role");
			return;
		}
		console.log(user[role], "->", target.value);
		user[role] = target.value;
	});
}

function showHome() {
	root.innerHTML = "";
	var node = document.createElement("div");
	node.className = "row";
	node.innerHTML = '<button type="button" action="add" class="col-md-1 btn btn-primary">'
		+ 'Add User</button>';
	root.appendChild(node);
	for (var i=0; i < max; ++i) {
		node = getUserEntry(users[i], true);
		root.appendChild(node)
	}	
}

function addEntry() {
	var name, department;
	name = prompt("Username: ");
	department = prompt("Department:");
	users.push({name: name, department: department, id: max+1});
	max += 1;
	var node = getUserEntry(users[max-1], true);
	root.appendChild(node);
}

showHome();
setupInputListener();

root.addEventListener("click", function(event) {
	var target = event.target,
		user = null;
	if (target.nodeName !== "BUTTON") {
		console.log(target.nodeName, "not a button");
		return;
	}
	if (target.innerText === "Back") {
		// back home
		showHome();
		return;
	}
	if (target.attributes["action"]) {
		addEntry();
		return;
	}
	user = users.filter(function(d) {
			return d.id === parseInt(target.attributes["data-user-id"].value);
		});
	if (user.length === 0) {
		alert("No such user");
		return;
	}
	if (user.length === 1) {
		editUser(user[0]);
	} else {
		alert("Too many user found for that id. Possible DB corruption");
	}
});