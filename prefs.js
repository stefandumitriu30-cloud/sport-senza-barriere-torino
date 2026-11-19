"use strict";
if (window.top !== window.self) {
  document.documentElement.style.display = "none";
  try { window.top.location = window.self.location.href; } catch (e) {}
}
try{
  if(localStorage.getItem("ssb-big")==="1") document.documentElement.classList.add("big");
  if(localStorage.getItem("ssb-hc")==="1") document.documentElement.classList.add("hc");
}catch(e){}
