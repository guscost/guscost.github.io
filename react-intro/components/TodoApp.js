var TodoApp = React.createClass({
  
  displayName: "TodoApp",
  
  propTypes: {
    visible: React.PropTypes.bool.isRequired,
    todos: React.PropTypes.array.isRequired
  },
  
  // uncomment this to optimize (only render when it is or was just visible):
  
  //shouldComponentUpdate: function (nextProps, nextState) {
  //  return this.props.visible || nextProps.visible;
  //},
  
  _onAddTodo: function (text) {
    everythingElse.addTodo(text);  
  },
  
  render: function render() {
    var el = React.createElement;
    var cmp = this;
    
    // keep track of how many incomplete todos we have
    var totalIncomplete = 0;
  
    return el("div", {
      style: { 
        display: cmp.props.visible ? "block" : "none",
        fontSize: "24px" 
      }
    },
    
      // use our SimpleForm example component to submit new todos
      el(SimpleForm, {
        buttonText: "Add",
        onSubmitValue: cmp._onAddTodo
      }),
      
      el("div", {
        className: "row"
      },
      
        // list of todos
        el("div", {
          className: "col-xs-6"
        },
        
          // map the array of data to an array of elements
          _.map(cmp.props.todos, function (todo, index) {
            
            // aggregate incomplete todos while mapping to save CPU cycles
            if (!todo.done) { totalIncomplete++; }
            
            // return a "Todo" element to render for this todo
            return el(Todo, {
              key: todo.id,
              id: todo.id,
              text: todo.text,
              done: todo.done  
            });
            
          })
          
        ),
        
        // total remaining todos
        el("div", {
          className: "col-xs-6"
        },
          el("div", {
            style: { 
              // make the total count red if more than 10 items are incomplete
              color: totalIncomplete > 10 ? "red" : "black" 
            }
          },
            "Remaining: ",
            totalIncomplete
          )
        )
      )
    );
  }
});