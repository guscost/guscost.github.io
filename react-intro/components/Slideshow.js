var Slideshow = React.createClass({
  
  displayName: "Slideshow",
  
  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    currentSlide: React.PropTypes.number.isRequired,
    slides: React.PropTypes.array.isRequired,
    todos: React.PropTypes.array.isRequired,
    planetsPage: React.PropTypes.number.isRequired,
    planets: React.PropTypes.array.isRequired,
    itinerary: React.PropTypes.array.isRequired
  },

  componentDidMount: function() {
    $(document).on("keyup", this._onKeyUp);
    //window.addEventListener("keyup", this._onKeyUp);
    },

    componentWillUnmount: function() {
    $(document).off("keyup", this._onKeyUp);
    //window.removeEventListener("keyup", this._onKeyUp);
    },
  
  _onKeyUp: function (event) {
    switch (event.key) {
      case "ArrowDown":
        everythingElse.goToNextLine();
        break;
      case "ArrowLeft":
        everythingElse.goToPreviousSlide();
        break;
      case "ArrowRight":
        everythingElse.goToNextSlide();
        break;
    }
  },
  
  render: function render() {
    var el = React.createElement;
    var cmp = this;
    
    var slide = cmp.props.slides[cmp.props.currentSlide];
  
    return el("div", {
      onKeyUp: cmp._onKeyUp
    },  
      el(Slide, {
        title: slide.title,
        lines: slide.lines,
        displayUpToLine: slide.displayUpToLine  
      },
      
        // todo list example "sub-app"
        el(TodoApp, {
          visible: slide.code === "exampleTodoList",
          todos: cmp.props.todos
        }),

        // star wars itinerary example "sub-app"
        el(ItineraryApp, {
          visible: slide.code === "exampleItinerary",
          planetsPage: cmp.props.planetsPage,
          planets: cmp.props.planets,
          itinerary: cmp.props.itinerary
        })
        
      ),     
      
      // popup window to indicate "loading" status
      el(LoadingPopup, { visible: cmp.props.loading })
      
    );
  }
});
