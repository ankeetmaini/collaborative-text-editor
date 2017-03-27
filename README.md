# Collaborative Text Editor

# Online Collab Edit!

This is a post which helps and guides you **step-by-step** to create an awesome, tweet-worthy *Online Collaboration Text Editor*

Try [Collaborative Text Editor](https://collaborative-text-editor.herokuapp.com). Once you open this link, a unique URL will be generated which you can share with your friends and Whoaaaaa! Collaborate away!

## Let's add the skeleton

- Create a super simple [index.html](https://github.com/ankeetmaini/collaborative-text-editor/blob/7c8271eb0b018f2768a5de0a12c28bc1859fbacb/index.html) and add a header and a div for our doc!
- Create a CSS file, [app.css](https://github.com/ankeetmaini/collaborative-text-editor/blob/7c8271eb0b018f2768a5de0a12c28bc1859fbacb/css/app.css) and link it in the above HTML to start out with a pretty page!
 
![](https://canvas-files-prod.s3.amazonaws.com/uploads/3852fd85-bd5d-4ac9-9c41-29319cd2e7dd/starter-template.png)

Let's make it a little more functional!

- Create a JavaScript file in `js` directory, [app.js](https://github.com/ankeetmaini/collaborative-text-editor/blob/5aed6715742da413b2f9beea47b9bc9340f50834/js/app.js), and add the following three lines to see **magic**
 
``` js
var doc = document.getElementById('doc');
doc.contentEditable = true;
doc.focus();
```
- Yay, our doc is editable, go ahead and type. It even supports **Ctrl+B**, **Ctrl+I** to make text **bold** or *italic*
 
![](https://canvas-files-prod.s3.amazonaws.com/uploads/036ed349-bcd6-41a9-8744-736a2e491354/bare-bones-editor.gif)

Make it **awesome** by adding online collaboration. Woot!

- Generate a unique identifier if the doc is new, which will be used to implement collaborative edit feature and **append it to the URL as a query param**, so the URL becomes shareable. Yayyy!
 
``` js
  var id = getUrlParameter('id');
  if (!id) {
    location.search = location.search
      ? '&id=' + getUniqueId() : 'id=' + getUniqueId();
    return;
  }
```
- `getUrlParameter()` and `getUniqueId()` are two utility functions that we defined to help us get query params and generate unique keys
 
``` js
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
```
- To **make collaborative editor** we'll use [Pusher's real time capabilities](https://pusher.com/). We'll trigger changes whenever we make the change and also at the same time listen for changes which other people might be making.
- [Signup for Pusher](https://pusher.com/signup), or [Login](https://dashboard.pusher.com/accounts/sign_in) if you already have an account
- Once, you login, create an app by giving an `app-name` and choosing a `cluster` in the *Create App* screen
- Now that we've registered and created the app, add the `pusher's JavaScript library` in your `index.html`
 
``` html
<script src="https://js.pusher.com/4.0/pusher.min.js"></script>
```
- Connect to your app by calling the `Pusher` constructor with your `app key` as shown in the below line
 
``` js
var pusher = new Pusher('2dfd84a287faf2636372');
```
- Next, we need to subscribe to the changes which happen to our doc. In Pusher these can be called as `channels`. Every new document will be a new `channel` for us. Channel is represented by a `string`, in our case it'll be the unique Id we generated. [Read more about channels here.](https://pusher.com/docs/client_api_guide/client_channels)
 
``` js
// subscribe to the changes via Pusher
var channel = pusher.subscribe(id);
channel.bind('some-fun-event', function(data) {
  // do something meaningful with the data here
});
```
- Since, we are interested in listening to all the events happening for a document by all the users we can directly listen them without the need to route them to a server first. Enter [Pusher's Client Events](https://pusher.com/docs/client_api_guide/client_events#trigger-events)
- You need to enable `Client Events` in your `Settings` tab on Pusher's Dashboard
- Also client events should start with `client-`, and thus our event name **client-text-edit**;
- With these two lines, we've set our app listening to any change made on the doc by any user!
 
``` js
channel.bind('client-text-edit', function(html) {
  doc.innerHTML = html;
});
```
- Similarly to trigger events when you change content, so that other clients can see the changes, we attach an event listener
 
``` js
function triggerChange (e) {
  channel.trigger('client-text-edit', e.target.innerHTML);
}

doc.addEventListener('input', triggerChange);
```
- All of this is wrapped in a `Promise` as you can only trigger changes to the channel when you've successfully subscribed to the channel itself!
- To use private channels, you must be authenticated. [Pusher makes writing an auth server very easy](https://pusher.com/docs/authenticating_users#authEndpoint). I used their NodeJS template [here](server.js).
- With that, we have our first version of Collaborative Text Editor **ready**! Whistles :P
 
![](https://canvas-files-prod.s3.amazonaws.com/uploads/b3da0f15-7d96-45f0-98dd-81574915379d/collab-edit.gif)

Brownie points!

- To make this more awesome we can use [Pusher's Presence channels](https://pusher.com/docs/client_api_guide/client_presence_channels) which can even give information about the identity of the users who are editing your app!
 
## running locally

- clone the repository
 
``` bash
  git clone git@github.com:ankeetmaini/collaborative-text-editor.git
  cd collaborative-text-editor
  npm install
  npm start
```
- open [http://localhost:5000](http://localhost:5000)
 