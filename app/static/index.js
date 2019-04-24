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
