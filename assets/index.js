function beerSearch(event) {
  var CLIENTID = 'A0D5D7F766E859E3EF145BD051A3A576D2EA97CF'
  var CLIENTSECRET = 'EBF811599C0F5914F7F37349041336C86926AC40'

  fetch('https://api.untappd.com/v4/search/beer?q=' + document.getElementById("searchName").value + '&client_id=' + CLIENTID + '&client_secret=' + CLIENTSECRET , {
    method: 'GET'
    })
  .then(response => response.json())
  .then(function(data) {
    let Beers = data.response.beers.items
    document.getElementById("beer__search").classList.add("active");
    for (var i = 0; i < Beers.length; i++) {
      // console.log('<li onClick="addBeer(' + Beers[i].beer.bid + ')">' + Beers[i].beer.beer_name + '</li>');
      document.getElementById('beer_results').innerHTML +=

      '<form action="/add-beer" method="post"><img src="' + Beers[i].beer.beer_label + '"><input class="beer__name" name="beerImg" value="' + Beers[i].beer.beer_label + '"><input class="beer__bid" name="beerBid" value="' + Beers[i].beer.bid + '"><input class="beer__name" name="beerName" value="' + Beers[i].beer.beer_name + '"><h3>' + Beers[i].beer.beer_name + '</h3><button type="submit" name="button">Add</button></form>'

    }
  })
  .catch(error => console.error('Error:', error))
  event.preventDefault()
}

function slideright() {
  document.getElementById("userBeerList").classList.add("slideLeft");
  document.getElementById("matchesList").classList.add("slideLeft");
  document.getElementById("switch__titleMessage").classList.add("active");
  document.getElementById("switch__titleBeers").classList.remove("active");
}

function slideleft() {
  document.getElementById("matchesList").classList.remove("slideLeft");
  document.getElementById("userBeerList").classList.remove("slideLeft");
  document.getElementById("switch__titleMessage").classList.remove("active");
  document.getElementById("switch__titleBeers").classList.add("active");
}
