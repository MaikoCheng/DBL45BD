const buttonful1 = document.getElementById("fullscreen1");
buttonful1.addEventListener("click", function(){
  document.getElementById("my_dataviz").style.width = "91.5%";
  document.getElementById("my_dataviz").style.height = "80%";
  document.getElementById("my_dataviz").style.zIndex = 999;
  svg.attr("width", '200%')
  document.getElementById("fullscreenclose").style.display = "block";
  document.getElementById("nameb").style.display = "none";
  document.getElementById("my_dataviz2").style.display = "none";
  document.getElementById("main_text").style.display = "none";
  document.getElementById("main_text2").style.display = "none";
  document.getElementById("fullscreen2").style.display = "none";
  document.getElementById("fullscreen1").style.display = "none";
});