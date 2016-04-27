var ItineraryApp = React.createClass({
  
  displayName: "ItineraryApp",
  
  propTypes: {
    visible: React.PropTypes.bool.isRequired,
    planetsPage: React.PropTypes.number.isRequired,
    planets: React.PropTypes.array.isRequired,
    itinerary: React.PropTypes.array.isRequired
  },
  
  _onLoadNextPage: function () {
    everythingElse.loadNextPlanetsPage();
  },
  
  _onClickVisit: function (url) {
    everythingElse.addPlanetToItinerary(url);
  },
  
  _onClickRemoveStop: function (url) {
    everythingElse.removePlanetFromItinerary(url);
  },
  
  _onChangeScheduledVisit: function (url, value) {
    everythingElse.changePlanetScheduledVisit(url, value);
  },
  
  render: function render() {
    var el = React.createElement;
    var cmp = this;
  
    return el("div", {
      style: { 
        display: cmp.props.visible ? null : "none",
        fontSize: "18px" 
      }
    },      
    
      // main two-column layout
      el("div", {
        className: "row"
      },
      
        // planets column
        el("div", {
          className: "col-xs-6"
        },
        
          // navigation
          el("div", null,
          
            cmp.props.planetsPage ? el("span", null,
              "Page ",      
              cmp.props.planetsPage,
              " "
            ) : null,
            
            el("div", { 
              className: "btn btn-default",
              onClick: cmp._onLoadNextPage
            }, 
              cmp.props.planetsPage ? "Next" : "Load"
            )
            
          ),  
          el("br", null),
          
          // list of planets
          _.map(cmp.props.planets, function (planet, index) {
            
            // check if planet is already in the itinerary
            var alreadySelected = _.some(cmp.props.itinerary, { url: planet.url });
            
            return el("div", {
              key: planet.url,
              style: {
                display: alreadySelected ? "none" : null        
              }
            },            
              el("a", {
                style: { cursor: "pointer" },
                onClick: cmp._onClickVisit.bind(cmp, planet.url)
              }, 
                "Visit"
              ),
              
              " ",
              
              el("strong", null, planet.name),        
              " - ",
              
              planet.climate,
              " planet, ",
              
              "pop: ",
              planet.population.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              
              el("span", null)
            );        
          })
        ),
        
        // current itinerary
        el("div", {
          className: "col-xs-5"
        },
        
          // title
          el("h3", null, "Itinerary:"),
          
          // list of stops
          _.map(cmp.props.itinerary, function (item, index) {
            return el("div", {
              key: item.url,
              style: { marginBottom: "5px" }
            },
              el("span", { 
                style: { 
                  display: "inline-block",
                  width: "120px" 
                } 
              }, 
                item.name
              ),        
              " ",
              el(KW.DatePicker, {
                value: item.scheduledVisit,
                onChange: cmp._onChangeScheduledVisit.bind(cmp, item.url)
              }),
              " ",
              el("span", {
                className: "glyphicon glyphicon-trash",
                style: { cursor: "pointer" },
                onClick: cmp._onClickRemoveStop.bind(cmp, item.url)
              })
            );        
          })
        )
        
      )
    );
  }
});