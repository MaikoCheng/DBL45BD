const buttonful2 = document.getElementById("fullscreen2");
buttonful2.addEventListener("click", function(){
document.getElementById("fullscreenclose").style.display = "block";
document.getElementById("my_dataviz2").style.width = "91.5%";
document.getElementById("my_dataviz2").style.height = "80%";
document.getElementById("my_dataviz2").style.zIndex = 999;
document.getElementById("my_dataviz2").style.marginLeft = '145px';
document.getElementById("namea").style.display = "none";
document.getElementById("my_dataviz").style.display = "none";
document.getElementById("main_text").style.display = "none";
document.getElementById("main_text2").style.display = "none";
document.getElementById("fullscreen1").style.display = "none";
document.getElementById("fullscreen2").style.display = "none";
document.getElementById("nameb").style.marginLeft = "155px";

});