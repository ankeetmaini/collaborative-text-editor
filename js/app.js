// IIFE keeps our variables private
// and gets executed immediately!
(function () {
  // make doc editable and focus
  var doc = document.getElementById('doc');
  doc.contentEditable = true;
  doc.focus();

  // if this is a new doc, generate a unique identifier
  // append it as a query param
  var id = getUrlParameter('id');
  if (!id) {
    location.search = location.search
      ? '&id=' + getUniqueId() : 'id=' + getUniqueId();
    return;
  }
  
  return new Promise(function (resolve, reject) {
    // subscribe to the changes via Pusher
    var pusher = new Pusher('2dfd84a287faf2636372');
    var channel = pusher.subscribe(id);
    channel.bind('client-text-edit', function(html) {
      doc.innerHTML = html;
    });
    channel.bind('pusher:subscription_succeeded', function() {
      resolve(channel);
    });
  }).then(function (channel) {
    function triggerChange (e) {
      channel.trigger('client-text-edit', e.target.innerHTML);
    }

    doc.addEventListener('input', triggerChange);
  })

  // a unique random key generator
  function getUniqueId () {
    return 'private-' + Math.random().toString(36).substr(2, 9);
  }

  // function to get a query param's value
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
})()