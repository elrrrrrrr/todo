jQuery(function($){

})

window.Todo = Backbone.Model.extend({
	defaults: {
		done:false
	},

	toggle:function(){
		this.save({done:!this.get("done")})
	}
})

window.TodoList = Backbone.Collection.extend({
	model: Todo,
	localStorage: new Store("todos"),
	done: function(){
		return this.filter(function(todo){
			return todo.get('done')
		})
	},
	remaining:function(){
		return this.without.apply(this,this.done())	
	}
})

window.Todos = new TodoList 

window.TodoView = Backbone.View.extend({
	tagName : "li",
	template:$('#item-template').template(),
	events: {
		"change .check" : "toggleDone",
		"dblclick .todo-content" : "edit",
		"click .todo-destory" : "destroy",
		"keypress .todo-input" : "updateOnEnter",
		"blur .todo-input" : "close"
	},
	initialize: function() {
		_.bindAll(this, 'render' , 'clise' , 'remove')
		this.model.bind('change',this.render)
		this.model.bind('destroy',this.remove)
	},
	reder: function() {
		var element = _.template(this.template , this.model.toJSON());
		$(this.el).html(element)
		return this 
	},
	toggleDone:function() {
		this.model.toggle()
	},
	edit: function() {
		$(this.el).addClass("editing")
		this.input.focus()
	},
	close:function(e) {
		this.model.save({content:this.input.val()})
		$(this.el).removeClass("editing")
	},
	updateOnEnter: function(e){
		if (e.keyCode == 13) e.target.blur()
	},
	remove:function() {
		$(this.el).remove()
	},
	destroy: function() {
		this.model.destroy()
	}
})

window.AppView = Backbone.View.extend({
	el:$("#todoapp"),
	events: {
		"keypress #new-todo": "createOnEnter",
		"click .todo-clear a" : "clearCompleted"
	},
	initialize: function(){
		_.bindAll(this,'addOne','addAll','render')
		this.input = this.$("#new-todo")
		Todos.bind('add',this.addOne)
		
	}
})