// IIFE keeps our variables private
// and gets executed immediately!
(function () {
  var doc = document.getElementById('doc');
  doc.contentEditable = true;
  doc.focus();
})()