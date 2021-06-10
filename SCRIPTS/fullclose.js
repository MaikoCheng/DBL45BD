const buttonfulclose = document.getElementById("fullscreenclose");
buttonfulclose.addEventListener("click", function(){
  document.getElementById("fullscreenclose").style.display = "none";
  document.getElementById("my_dataviz2").style.width = "49.5%";
  document.getElementById("my_dataviz2").style.zIndex = 1;
  document.getElementById("my_dataviz").style.width = "49.5%";
  document.getElementById("my_dataviz2").style.height = "100%";
  document.getElementById("my_dataviz").style.zIndex = 1;
  document.getElementById("nameb").style.display = "block";
  document.getElementById("namea").style.display = "block";
  document.getElementById("my_dataviz").style.display = "block";
  document.getElementById("main_text").style.display = "block";
  document.getElementById("main_text2").style.display = "block";
  document.getElementById("fullscreen1").style.display = "block";
  document.getElementById("my_dataviz2").style.display = "block";
  document.getElementById("main_text").style.display = "block";
  document.getElementById("main_text2").style.display = "block";
  document.getElementById("fullscreen2").style.display = "block";
})
