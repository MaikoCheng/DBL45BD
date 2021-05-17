const buttonfulclose = document.getElementById("fullscreenclose");
buttonfulclose.addEventListener("click", function(){
  document.getElementById("fullscreenclose").style.display = "none";
  document.getElementById("my_dataviz2").style.width = "45.4%";
  document.getElementById("my_dataviz2").style.height = "600px";
  document.getElementById("my_dataviz2").style.zIndex = 1;
  document.getElementById("my_dataviz2").style.marginLeft = "53.7%";
  document.getElementById("my_dataviz").style.width = "45.4%";
  document.getElementById("my_dataviz").style.height = "600px";
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
  document.getElementById("nameb").style.marginLeft = "54.3%";
})