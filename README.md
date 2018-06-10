# Online Collaboration Text Editor

This is a post which helps and guides you **step-by-step** to create an awesome, tweet-worthy *Online Collaboration Text Editor*

You can view a full tutorial [here](https://pusher.com/tutorials/collaborative-text-editor-javascript/)

*This is a glimpse of what we will be making at the end of this post.*

![](https://dl.dropboxusercontent.com/s/on1kww90bp5rm8d/online-collaboration-text-editor-demo.gif)

Try [Collaborative Text Editor](https://collaborative-text-editor.herokuapp.com). Open this link, and share with your friends and Whoaaaaa! Collaborate away!

# Let's add the skeleton

- Create a super simple [index.html](https://github.com/ankeetmaini/collaborative-text-editor/blob/7c8271eb0b018f2768a5de0a12c28bc1859fbacb/index.html) and add a header and a div for our doc!
 
``` html
<!DOCTYPE>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Collaborative Text Editor</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet"></link>
  </head>
  <body>
    <header class="header">
      <h1 class="header__h1">Online Collab Edit</h1>
    </header>
    <div class="doc">
      <div class="doc__background-ribbon"></div>
      <div class="doc__text-editor hidden"></div>
    </div>
  </body>
</html>

```
- Create a CSS file, [app.css](https://github.com/ankeetmaini/collaborative-text-editor/blob/7c8271eb0b018f2768a5de0a12c28bc1859fbacb/css/app.css) and link it in the above HTML to start out with a pretty page!
 
![](https://dl.dropboxusercontent.com/s/vyb72saga8xbhes/online-collaboration-text-starter-template.png)

# Let's make it a little more functional!

- Create a JavaScript file in `js` directory, [app.js](https://github.com/ankeetmaini/collaborative-text-editor/blob/5aed6715742da413b2f9beea47b9bc9340f50834/js/app.js), and add the following three lines to see the **magic!**
 
``` js
var doc = document.getElementById('doc');
doc.contentEditable = true;
doc.focus();
```
- And with that our doc is editable, go ahead and type. It even supports **Ctrl+B**, **Ctrl+I** to make text **bold** or *italic*
 
![](https://dl.dropboxusercontent.com/s/lx298eb5qfs6gtg/online-collaboration-text-bare-bones-editor.gif)

# Make it **awesome** by adding online collaboration. Woot!

- Generate a unique identifier if the doc is new, which will be used to implement collaborative edit feature and **append it to the URL as a query param**, so the URL becomes shareable and unique.
 
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
- To **make collaborative editor** we'll use [Pusher's real time capabilities](https://pusher.com/). We'll trigger events whenever we make any change to the document and also at the same time listen for changes of other users for the same document.
- [Signup for Pusher](https://pusher.com/signup), or [Login](https://dashboard.pusher.com/accounts/sign_in) if you already have an account.
- Once, you login, create an app by giving an `app-name` and choosing a `cluster` in the *Create App* screen
- Now that we've registered and created the app, add the `pusher's JavaScript library` in your `index.html`
 
``` html
<script src="https://js.pusher.com/4.0/pusher.min.js"></script>
```
- Connect to your app by calling the `Pusher` constructor with your `app key` as shown in the below line
 
``` js
var pusher = new Pusher(<INSERT_PUSHER_APP_KEY_HERE>);
```
- Next, we need to subscribe to the changes which happen to our document
- **With Pusher** these are called `channels`. Every new document will be a new `channel` for us. Channel is represented by a `string`, in our case it'll be the unique Id we generated above. [Read more about the awesome channels here.](https://pusher.com/docs/client_api_guide/client_channels)
 
``` js
// subscribe to the changes via Pusher
var channel = pusher.subscribe(id);
channel.bind('some-fun-event', function(data) {
  // do something meaningful with the data here
});
```
- Since, we want to listen all the events triggered for a document by all the users, we can do that directly without the need to route them to a server first. Enter [Pusher's Client Events](https://pusher.com/docs/client_api_guide/client_events#trigger-events)
- You need to enable `Client Events` in your `Settings` tab on [Pusher's Dashboard](https://dashboard.pusher.com/)
- `Client Events` should start with `client-`, and thus our event name **client-text-edit**. Also `Client Events` have a number of restrictions that are important to know about while creating your awesome app. [Read about them here.](https://pusher.com/docs/client_api_guide/client_events#trigger-events)
- With these two lines, we've set our app listening to any change made on the doc by any user!
 
``` js
channel.bind('client-text-edit', function(html) {
  doc.innerHTML = html;
});
```
- Similarly we trigger **client-text-edit** *event* when we change content, so that other clients can see the changes almost immediately!
 
``` js
function triggerChange (e) {
  channel.trigger('client-text-edit', e.target.innerHTML);
}

doc.addEventListener('input', triggerChange);
```
- With [Pusher's amazing library](https://pusher.com/) all of this complexity is abstracted out for us and we can truly focus on crafting **superb product and top-class experience** for our Users!
- All of this is wrapped in a `Promise` as you can only trigger changes to the channel when you've successfully subscribed to the channel itself!
- To use private channels, you must be authenticated. [Pusher makes writing an auth server very easy](https://pusher.com/docs/authenticating_users#authEndpoint). I used their NodeJS template [here](server.js).
- With that, we have our first version of Collaborative Text Editor **ready**! Whistles :P
- This `demo app` doesn't account for cases like concurrent edits at the same place in the document. For a *production-like* app you'd want to use [Operational Transformation](http://operational-transformation.github.io/) to solve the problem.
 
![](https://dl.dropboxusercontent.com/s/1pa8g5a44owf54q/online-collaboration-text-collab-edit.gif)

## Brownie points!

- To make this more awesome we can use [Pusher's Presence channels](https://pusher.com/docs/client_api_guide/client_presence_channels) which can even give information about the identity of the users who are editing your app!
 
## Next Steps

- Add support for code highlighting for your choice of language and you've a collaborative code editor ready, which you can use to solve a fun puzzle or for a remote interview!
 
## PS: [Pusher's realtime capability FTW!](https://pusher.com/)

## running locally

- clone the repository
 
``` bash
  git clone git@github.com:ankeetmaini/collaborative-text-editor.git
  cd collaborative-text-editor
  npm install
  npm start
```
- open [http://localhost:5000](http://localhost:5000)
 
## show me the code

- Code is hosted on GitHub [collaborative-text-editor](https://github.com/ankeetmaini/collaborative-text-editor)
 
