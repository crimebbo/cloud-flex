/* App frontend script */
// eslint-disable-next-line no-unused-vars
var utils = require('public/js/common/utills');


function getConfig() {

  // AP.context.getToken(function (token) {
  //   var xhr = new XMLHttpRequest();
  //
  //   xhr.open('GET', '/getConfig', true);
  //   xhr.onload = function () {
  //     // Request finished. Do processing here.
  //   };
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       var responseObject = JSON.parse(xhr.response);
  //       console.log('responseObject', responseObject);
  //     }
  //   };
  //   xhr.send(null);
  // });

  // let userAccountId;
  // let tokens;
  // AP.user.getCurrentUser(function(user) {
  //     userAccountId = user.atlassianAccountId;
  // });
  //  AP.context.getToken(function(token) {
  //      tokens = token;
  //  });
  // AJS.$.ajax({
  //     url: 'https://oscitest.atlassian.net/wiki/rest/api/user?accountId={'+ userAccountId + '}',
  //     type: "GET",
  //     dataType: "json",
  //     contentType: "application/json",
  //     async: false, headers: {
  //         'Authorization' : "JWT {{tokens}}"
  //     },
  //     success: function (data) {
  //         console.log(data);
  //     },
  //     error: function(response) {
  //
  //         console.log(response);
  //     }
  // })

  // let userAccountId;
  // AP.user.getCurrentUser(function(user) {
  //     userAccountId = user.atlassianAccountId;
  // });
  //
  // AP.context.getToken(function(token) {
  //     var xhr = new XMLHttpRequest();
  //
  //     xhr.open('GET', '/setConfig?jwt=' + token +'&userAccountId=' + userAccountId, true);
  //     xhr.onload = function () {
  //         // Request finished. Do processing here.
  //     };
  //     xhr.onreadystatechange = function() {
  //         if (xhr.readyState === 4) {
  //             var responseObject = JSON.parse(xhr.response);
  //             var healthClass = responseObject && responseObject.status === 'ok' ? 'good' : 'bad';
  //             var responseJson = JSON.stringify(responseObject, null, 2);
  //         }
  //     };
  //     xhr.send(null);
  // });
  //
  // let data ={
  //     name: 'some text1', description: 'test2'
  // };

  let data = {
    'userLimit': 0,
    'notiLimit': 10,
    'lastLogin': 1,
    'deactiveScheduleHour': 2,
    'deactiveScheduleMin': 0,
    'countCanuseDate': "2020.06.25 17:19",
    'countCanuseGroup': 9,
    'countSourceDate': "2020.06.25 17:19",
    'countSourceGroup': 29,
    'deactiveEnabled': true,
    'deactiveScheduleInterval': 7,
    'notiGroup': "confluence-administrators",
    'reportingScheduleHour': 1,
    'sourceGroup': "active",
    'targetGroup': "user_test_group",
  };
  // AP.require(['request'], function(request) {
  //     request({
  //         url: '/rest/atlassian-connect/1/addons/kr.osci.apps.cloud.flex.jira/properties/my-flex-key?jsonValue=true',
  //         data: JSON.stringify(data),
  //         type: 'PUT',
  //         success: function(response) {
  //             // Convert the string response to JSON
  //             response = JSON.parse(response);
  //             console.log(response);
  //         },
  //         error: function(response) {
  //             console.log("Error loading API (" + response + ")");
  //             console.log(arguments);
  //             console.log(response);
  //         },
  //         contentType: "application/json"
  //     });
  // });

  AP.require(['request'], function(request) {
      request({
          url: '/rest/atlassian-connect/1/addons/kr.osci.apps.flex_jira/properties/my-flex-key',
          type: 'GET',
          success: function(response) {
              // Convert the string response to JSON
              response = JSON.parse(response);
              console.log(response);
          },
          error: function(response) {
              console.log("Error loading API (" + response + ")");
              console.log(arguments);
              console.log(response);
          },
          contentType: "application/json"
      });
  });

  var flag = AP.flag.create({
    title: 'Successfully created a flag.',
    body: 'This is a flag.',
    type: 'success',
    actions: {
      'actionkey': 'Click me'
    }
  });
  // console.log(flag);
  //AP.navigator.reload();

  // AP.user.getUser(function(user){
  //     console.log("user id", user.id);
  //     console.log("user key", user.key);
  //     console.log("user name", user.fullName);
  // });
  //
  // AP.user.getCurrentUser(function(user) {
  //     console.log("The Atlassian Account ID is", user.atlassianAccountId);
  // });
  //
  // AP.user.getLocale(function(locale){
  //     alert(locale);
  // });

  // AP.request('/rest/api/group/pseudo group/member')
  //     .then(data => alert(data.body))
  //     .catch(e => alert(e.err));
}

function fillOutGetContextElement(elementId) {
  var container = document.getElementById(elementId);
  if (AP.context && AP.context.getContext) {
    AP.context.getContext(function (context) {
      fillOutContext(context, container);
    });
  } else {
    container.innerHTML = '<div class="bad">AP.context.getContext() is not available :(</div>';
  }
}

function fillOutWithTokenElement(elementId) {
  var container = document.getElementById(elementId);
  if (AP.context && AP.context.getToken) {
    AP.context.getToken(function (token) {
      container.innerHTML = `<div>Retrieved the following token:</div><pre class="good wrappable">${token}</pre>`;
    });
  } else {
    container.innerHTML = '<div class="bad">AP.context.getToken() is not available :(</div>';
  }
}

function bindBindRefreshContextClickHandler(buttonId, elementId) {
  var button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', function () {
      AP.context.getContext(function (context) {
        var container = document.getElementById(elementId);
        fillOutContext(context, container);
      });
      button.blur();
    }, false);
  }
}

function bindBindRefreshTokenClickHandler(buttonId, elementId) {
  var button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', function () {
      AP.context.getToken(function (token) {
        var container = document.getElementById(elementId);
        container.innerHTML = `<div>Retrieved the following token:</div><pre class="good wrappable">${token}</pre>`;
      });
      button.blur();
    }, false);
  }
}


function bindBindSendTokenClickHandler(buttonId, elementId) {
  var button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', function () {
      AP.context.getToken(function (token) {
        var xhr = new XMLHttpRequest();
        console.log('token', token);
        xhr.open('GET', '/handle-context-token?context-token=' + token, true);
        xhr.onload = function () {
          // Request finished. Do processing here.
        };
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            var responseObject = JSON.parse(xhr.response);
            var healthClass = responseObject && responseObject.status === 'ok' ? 'good' : 'bad';
            var responseJson = JSON.stringify(responseObject, null, 2);
            var container = document.getElementById(elementId);
            container.innerHTML = `<div>Sent the token to the app server and got back:</div><pre class="${healthClass} wrappable">${responseJson}</pre>`;
          }
        };
        xhr.send(null);
      });
      button.blur();
    }, false);
  }
}

function fillOutContext(context, container) {
  var contextJson = JSON.stringify(context, null, 2);
  var contextHtml = '<div>Retrieved the following context:</div><pre class="good">' + contextJson + '</pre>';
  container.innerHTML = contextHtml;
}