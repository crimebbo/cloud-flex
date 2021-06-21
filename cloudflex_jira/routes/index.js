import verifiedclaims from "./uitills/verifiedclaims";
import cronjob from "./scheduler/cron";
import emailCrypto from "./uitills/crypto";
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
const fetch = require('node-fetch');
const Headers = require('fetch-headers');
export default function routes(app, addon, jwt, logger) {

  /**
   * 아틀라시안제품정보 및 설정 등록
   */
  app.get('/', (req, res) => {
    res.format({
      // If the request content-type is text-html, it will decide which to serve up
      'text/html': function () {
        res.redirect('/atlassian-connect.json');
      },
      // This logic is here to make sure that the `atlassian-connect.json` is always
      // served up when requested by the host
      'application/json': function () {
        res.redirect('/atlassian-connect.json');
      }
    });

  });

  /**
   * 최초 로딩 페이지
   */

  app.get('/init', addon.authenticate(), (req, res) => {
    // app.get('/init', (req, res) => {
    // Rendering a template is easy; the render method takes two params:
    // name of template and a json object to pass thse context in.
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info('call address :::::::::' + ip);

    res.render('index', {
      title: 'Flexible User License'
      //issueId: req.query['issueId']
    });
  });

  /**
   *  healthcheck
   */
  app.get('/healthcheck', function (req, res) {
    logger.info('Health Check Request :::::::::' + 200);
    res.sendStatus(200);
  });

  /**
   * orgApiKey check
   */

  app.get('/checkOrgApiKey', function (req, res) {

    var accountId = req.query['accountId'];
    var orgApiKey = req.query['orgApiKey'];

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + orgApiKey);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://api.atlassian.com/users/"+ accountId +"/manage/profile", requestOptions)
        .then(response => response.text())
        .then(result => {
          return res.json(JSON.parse(result));
        })
        .catch(error => logger.error('checkOrgApiKey error : ' + error));
  });


  /**
   * 그룹에서 멤버 제거
   */
  app.get('/removeMemberToGroup', function (req, res) {

    var token = req.query['context-token'];
    var name = req.query['name'];
    var accountId = req.query['accountId'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];

    /**
     * 애드온 환경 설정 정보 가저오기 jwt 토큰을 사용하여 애드온 세팅 정보 취득
     */
    verifiedclaims(token, jwt, addon, removeMemberToGroup);

    function removeMemberToGroup(data) {
      let baseUrl = data.baseUrl;
      var basicAuth = adminID + ':' + adminApiToken;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append('Accept', 'application/json');

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(baseUrl + '/rest/api/3/group/user?groupname=' + name + '&accountId=' + accountId, requestOptions)
        .then(response => {
          logger.info(
            `Response: ${response.status} ${response.statusText}`
          );

          let resultData = {
            'response.status': response.status,
            'response.statusText': response.statusText
          };

          return res.json(resultData);
        })
        .then(result => result)
        .catch(error => logger.error('removeMemberToGroup error : ' + error));
    }
  });


  /**
   * 그룹에 멤버 추가
   */
  app.get('/addMemberToGroup', function (req, res) {

    var token = req.query['context-token'];
    var name = req.query['name'];
    var accountId = req.query['accountId'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];

    verifiedclaims(token, jwt, addon, addMemberToGroup);

    function addMemberToGroup(data) {
      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({ "accountId": accountId });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(baseUrl + "/rest/api/3/group/user?groupname=" + name, requestOptions)
        .then(response => {
          let resultData = {
            'response.status': response.status
          };
          return res.json(resultData);
        })
        .then(result => result)
        .catch(error => logger.error('addMemberToGroup error : ' + error));
    }

  });

  /**
   * wiki 라이선스 정보 가저오기
   */
  app.get('/getWikiLicenseInfo', function (req, res) {

    var token = req.query['context-token'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];
    verifiedclaims(token, jwt, addon, getSettingInfo);

    function getSettingInfo(data) {
      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var jiraLicMaxUser, jiraLicUseCnt;

      fetch(baseUrl + "/rest/plugins/1.0/available/atlassian", requestOptions)
        .then(response => response.text())
        .then(result => {
          var responseObject = JSON.parse(result);
          jiraLicMaxUser = responseObject.hostStatus.hostLicense.maximumNumberOfUsers;
          fetch(baseUrl + "/rest/api/3/applicationrole", requestOptions)
            .then(response => response.text())
            .then(result => {
              var responseObject = JSON.parse(result);
              for (var idx in responseObject) {
                if (responseObject[idx].key === 'jira-software') {
                  jiraLicUseCnt = responseObject[idx].userCount;
                }
              }
              var lic = {
                'jiraLicMaxUser': jiraLicMaxUser,
                'jiraLicUseCnt': jiraLicUseCnt
              };
              return res.json(lic);
            })
            .catch(error => logger.error('getWikiLicenseInfo : ' + error));

        })
        .catch(error => logger.error('getWikiLicenseInfo : ' + error));
    }

  });

  /**
   * wiki 대시보드 멤버 카운트 수 가져오기
   */
  app.get('/getDashboardMemberCount', function (req, res) {

    var token = req.query['context-token'];
    var groupName1 = req.query['groupName1'];
    var groupName2 = req.query['groupName2'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];

    verifiedclaims(token, jwt, addon, getDashboardMemberInfo);

    function getDashboardMemberInfo(data) {

      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };


      var final = [];
      fetch(baseUrl + "/rest/api/3/group/member?groupname=" + groupName1, requestOptions)
        .then(response => response.text())
        .then(result => {
          var res1 = JSON.parse(result);

          var g1 = res1.values.filter(function (results, i) {
            return results.accountType === 'atlassian';
          });
          var group1Obj = {
            'size': g1.length,
            'usergroup': groupName1
          };
          final.push(group1Obj);

          fetch(baseUrl + "/rest/api/3/group/member?groupname=" + groupName2, requestOptions)
            .then(response => response.text())
            .then(result => {
              var res2 = JSON.parse(result);

              var g2 = res2.values.filter(function (results, i) {
                return results.accountType === 'atlassian';
              });
              var group2Obj = {
                'size': g2.length,
                'licenseGroup': groupName2
              };
              final.push(group2Obj);
              return res.json(final);
            })
            .catch(error => logger.error('getDashboardMemberCount : ' + error));

        })
        .catch(error => logger.error('getDashboardMemberCount : ' + error));
    }

  });

  /**
   * jira  멤버 카운트 수 가져오기총
   */
  app.get('/getGroupTotalMembers', function (req, res) {

    var token = req.query['context-token'];
    var groupName1 = req.query['groupName1'];
    var groupName2 = req.query['groupName2'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];

    verifiedclaims(token, jwt, addon, getGroupTotalMemberinfo);

    function getGroupTotalMemberinfo(data) {

      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };


      var g1, g2;
      fetch(baseUrl + "/wiki/rest/api/group/" + groupName1 + "/member", requestOptions)
        .then(response => response.text())
        .then(result => {
          g1 = JSON.parse(result);
          fetch(baseUrl + "/wiki/rest/api/group/" + groupName2 + "/member", requestOptions)
            .then(response => response.text())
            .then(result => {
              g2 = JSON.parse(result);
              var g3 = g1.results.concat(g2.results);
              var rest = g3.filter(function (results, i) {
                return results.accountType === 'atlassian';
              });

              return res.json(rest);
            })
            .catch(error => logger.error('getGroupTotalMembers : ' + error));

        })
        .catch(error => logger.error('getGroupTotalMembers : ' + error));
    }

  });

  /**
   * jira  유저 현재상태
   */
  app.get('/getGroupMemberState', function (req, res) {

    var token = req.query['context-token'];
    var groupName1 = req.query['groupName1'];
    var groupName2 = req.query['groupName2'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];
    verifiedclaims(token, jwt, addon, getGroupMemberStateInfo);

    function getGroupMemberStateInfo(data) {

      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };


      var g1, g2;
      fetch(baseUrl + "/wiki/rest/api/group/" + groupName1 + "/member", requestOptions)
        .then(response => response.text())
        .then(result => {
          g1 = JSON.parse(result);

          g1.results = g1.results.filter(function (results, i) {
            return results.accountType === 'atlassian';
          });
          fetch(baseUrl + "/wiki/rest/api/group/" + groupName2 + "/member", requestOptions)
            .then(response => response.text())
            .then(result => {
              g2 = JSON.parse(result);
              g2.results = g2.results.filter(function (results, i) {
                return results.accountType === 'atlassian';
              });
              var resst = {
                'sourceGroup': g1.results,
                'targetGroup': g2.results
              }
              return res.json(resst);
            })
            .catch(error => logger.error('getGroupMemberState : ' + error));

        })
        .catch(error => logger.error('getGroupMemberState : ' + error));
    }

  });

  app.get('/getGroupMembers', function (req, res) {

    var token = req.query['context-token'];
    var groupName = req.query['groupName'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];

    verifiedclaims(token, jwt, addon, getGroupMemberinfo);

    function getGroupMemberinfo(data) {

      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(baseUrl + "/rest/api/3/group/member?groupname=" + groupName, requestOptions)
        .then(response => response.text())
        .then(result => {
          var responseObject = JSON.parse(result);
          return res.json(responseObject);
        })
        .catch(error => logger.error('getGroupMembers : ' + error));
    }

  });

  app.get('/getAllMemberCount', function (req, res) {

    var token = req.query['context-token'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];
    verifiedclaims(token, jwt, addon, getAllMemberinfo);

    function getAllMemberinfo(data) {

      var basicAuth = adminID + ':' + adminApiToken;
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      //fetch(baseUrl + "/rest/api/3/users/search", requestOptions)
      fetch(baseUrl + "/wiki/rest/api/group/member", requestOptions)
        .then(response => response.text())
        .then(result => {
          var responseObject = JSON.parse(result);
          return res.json(responseObject);
        })
        .catch(error => logger.error('getAllMemberCount : ' + error));
    }

  });


  /**
   * wiki 스케쥴러 등록 서비스
   */
  app.get('/setSchedulerService', function (req, res) {

    var token = req.query['context-token'];
    var deactiveScheduleHour = req.query['deactiveScheduleHour'];
    var deactiveScheduleInterval = req.query['deactiveScheduleInterval'];
    var deactiveEnabled = req.query['deactiveEnabled'];
    var actionType = req.query['actionType'];

    var orgKey = req.query['orgApiKey'];
    var adminApiToken = req.query['adminApiToken'];
    var adminID = req.query['adminID'];
    var authUser = req.query['authAdminEmail_id'];
    var authPass = req.query['authAdminEmail_pw'];
    var locale = req.query['locale'];

    /**
     * 메일 패스워드 복호
     * @type {string}
     */
    const key = 'flexsalt';
    if(authPass !=='') authPass = emailCrypto('dec',authPass, key);

    var rs = cronjob(app, addon, jwt, deactiveScheduleHour, deactiveScheduleInterval, deactiveEnabled, token,
      orgKey, adminID, adminApiToken, authUser, authPass, actionType,locale);
    return res.json(rs.toString());
  });

  app.get('/getLastActive', function (req, respons) {
    var token = req.query['context-token'];
    var lastDays = req.query['lastDays'];
    var orgApiKey = req.query['orgApiKey'];
    var targetGroup = req.query['targetGroup'];
    var adminApiToken = req.query['adminApiToken'];
    var adminID = req.query['adminID'];

    verifiedclaims(token, jwt, addon, getSettingInfo);

    function getSettingInfo(data) {

      getOrgId(orgApiKey, getLastActiveDate);

      let baseUrl = data.baseUrl;

      function getLastActiveDate(res) {
        var orgInfos = JSON.parse(res);
        if(orgInfos.data[0] === undefined){
          var removeInfo = {
            removeCnt: 0,
            licGroupSize: 0,
            status : 400
          }
          return respons.json(removeInfo);
        }
        var orgId = orgInfos.data[0].id;

        getAllMember(orgId, _setAllMeber);

        function _setAllMeber(allMember) {
          var licUserList = [];

          getCanuseGroup(getCanUserinfo);

          function getCanUserinfo(res) {

            var canuseInfo = JSON.parse(res);

            for (var i in allMember) {
              for (var j in canuseInfo.values) {
                if (canuseInfo.total > 0 && canuseInfo.values[j].accountId === allMember[i].account_id) {
                  var removeUser = new Object();
                  removeUser.last_active = getLastActiveTime(allMember[i].last_active);
                  removeUser.name = allMember[i].name;
                  removeUser.account_id = allMember[i].account_id;
                  removeUser.email = allMember[i].email;
                  licUserList.push(removeUser);
                }
              }
            }
            var agoTime = lastDays === 0 ? new Date().getTime() : new Date().getTime() - parseInt(lastDays) * 24 * 60 * 60 * 1000;

            var removeUserList = [];
            for (let idx in licUserList) {
              if (parseInt(licUserList[idx].last_active) < agoTime) {
                removeUserList.push(licUserList[idx]);
              }
            }

            var removeInfo = {
              removeCnt: removeUserList.length,
              licGroupSize: canuseInfo.total
            }
            respons.json(removeInfo);
          }
        }

      }

      function getCanuseGroup(callback) {
        var myHeaders = new Headers();
        var basicAuth = adminID + ':' + adminApiToken;
        myHeaders.append('Authorization', `Basic ${Buffer.from(
          basicAuth).toString('base64')}`);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        console.log('targetGroup', targetGroup);
        fetch(baseUrl + "/rest/api/3/group/member?groupname=" + targetGroup, requestOptions)
          .then(response => response.text())
          .then(result => {
            callback(result)

          })
          .catch(error => logger.error('getCanuseGroup " ', error));
      }

      function getOrgId(orgApiKey, callback) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + orgApiKey);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("https://api.atlassian.com/admin/v1/orgs", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result)
            callback(result)
          })
          .catch(error => {
            logger.error('getOrgId " ' + error);
            callback(error);
          });
      }

      function getLastActiveTime(lastActive) {
        // eslint-disable-next-line use-isnan
        return lastActive === undefined ? new Date().getTime() : new Date(lastActive).getTime();
      }

      function getAllMember(orgId, callback) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + orgApiKey);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("https://api.atlassian.com/admin/v1/orgs/" + orgId + "/users", requestOptions)
          .then(response => response.text())
          .then(result => {
            var userMember = JSON.parse(result);
            if (userMember.links.next !== undefined) {
              getCursorAllMember(userMember.links.next, _setCursorAllMember);

              function _setCursorAllMember(res) {
                var nextMember = JSON.parse(res);
                userMember = userMember.data.concat(nextMember.data);
                if (nextMember.links.next !== undefined) {
                  getCursorAllMember(nextMember.links.next, _setCursorAllMember);
                } else {
                  callback(userMember);
                }
              }
            } else {
              callback(userMember);
            }

          })
          .catch(error => logger.error('getAllMember : ' + error));
      }

      function getCursorAllMember(url, callback) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + orgApiKey);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(url, requestOptions)
          .then(response => response.text())
          .then(result => {
            callback(result)
          })
          .catch(error => logger.error('getCursorAllMember : ' + error));
      }
    }
  });


  /**
   * store 조회
   */
  app.get('/getflexStore', function (req, res) {
    var token = req.query['context-token'];

    verifiedclaims(token, jwt, addon, getStore);

    function getStore(data) {

      var userKey = data.publicKey;
      var clientKey = data.clientkey;
      var addonkey = data.addonkey;
      var url = '/rest/atlassian-connect/1/addons/kr.osci.apps.flex_jira/properties/flex-license-key';
      var options = {
        headers: {
          'X-Atlassian-Token': 'nocheck'
        },
        url: '/rest/atlassian-connect/1/addons/kr.osci.apps.flex_jira/properties/flex-license-key',
        json: 'true'
      };

      getHTTPClient(clientKey, userKey, addonkey).get(
        '/rest/atlassian-connect/1/addons/kr.osci.apps.flex_jira/properties/flex-license-key',
        function (err, response, contents) {
          //console.log('contents1',contents);
          contents = JSON.parse(contents);
          console.log('contents1', contents);

          // res.render('test', {
          //   'test': contents,
          //   'status': response.statusCode
          // });
        });



    }
  });

  function getHTTPClient(clientKey, userKey, addonkey) {
    return addon.httpClient({
      clientKey: clientKey,
      userKey: userKey,
      appKey: addonkey
    });
  }


  /**
   * jwt 토큰  정보
   */
  app.get('/handle-context-token', function (req, res) {
    var token = req.query['context-token'];
    if (token) {
      try {
        var unverifiedClaims = jwt.decode(token, '', true); // decode without verification;
        var issuer = unverifiedClaims.iss;
        if (issuer) {
          var clientKey = issuer;
          console.log('clientKey', clientKey);
          addon.settings.get('clientInfo', clientKey).then(function (settings) {
            var secret = settings.sharedSecret;
            console.log('secret', secret);
            var verifiedClaims = jwt.decode(token, secret, false);
            console.log('verifiedClaims', verifiedClaims);
            var context = verifiedClaims.context;
            var response = {
              status: 'ok',
              context: context
            };
            var responseJson = JSON.stringify(response, null, 3);
            console.log('responseJson', responseJson);
            res.setHeader('Content-Type', 'application/json');
            res.send(responseJson);
          }).catch(function (error) {
            res.status(400).send({
              status: 'error',
              message: 'Unable to verify JWT token: ' + error
            });
          });
        }
      } catch (error) {
        res.status(400).send({
          status: 'error',
          message: 'Unable to decode JWT token: ' + error
        });
      }
    }
  });

  /**
   * api key 유효성 체크
   */
  app.get('/validateConfig', function (req, res) {

    var token = req.query['context-token'];
    var orgKey = req.query['p1'];
    var adminToken = req.query['p2'];
    var acid = req.query['acid'];
    var pass = true;
    var orgState = 200;
    var adminKeyState = 400;
    var emailID;

    verifiedclaims(token, jwt, addon, getSettingInfo);

    function getSettingInfo(data) {
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + orgKey);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("https://api.atlassian.com/admin/v1/orgs", requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(result);
          if (result.code === 401) {
            pass = false;
            orgState = 400;
          }

          fetch("https://api.atlassian.com/users/" + acid + "/manage/profile", requestOptions)
            .then(response => response.text())
            .then(result => {
              result = JSON.parse(result);
              emailID = result.account.email !== undefined ? result.account.email : "";

              var myHeaders = new Headers();
              var basicKey = emailID + ':' + adminToken;
              myHeaders.append('Authorization', `Basic ${Buffer.from(
                basicKey).toString('base64')}`);
              myHeaders.append("Content-Type", "application/json");


              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch(baseUrl + "rest/api/3/user?accountId=" + acid, requestOptions)
                .then(response => response.text())
                .then(result => {
                  result = JSON.parse(result);
                  if (result.accountId === acid) {
                    adminKeyState = 200;
                  } else {
                    pass = false;
                    adminKeyState = 400;
                  }

                  var resultMsg = {
                    orgkeyState: orgState,
                    adminKeyState: adminKeyState,
                    emailState: '',
                    resState: pass,
                    emailID: emailID,
                    accountID: acid
                  }
                  res.json(resultMsg);

                })
                .catch(error => {
                  logger.error('error' + error)
                  var resultMsg = {
                    orgkeyState: orgState,
                    adminKeyState: 400,
                    emailState: '',
                    resState: false,
                    emailID: emailID,
                    accountID: acid
                  }
                  console.log('resultMsg', resultMsg);
                  res.json(resultMsg);
                });
            })
            .catch(error => {
              logger.error('error', error)
              var resultMsg = {
                orgkeyState: orgState,
                adminKeyState: adminKeyState,
                emailState: '',
                resState: false,
                emailID: emailID,
                accountID: acid
              }
              res.json(resultMsg);
            });

        })
        .catch(error => {
          logger.error('error', error)
          var resultMsg = {
            orgkeyState: orgState,
            adminKeyState: adminKeyState,
            emailState: '',
            resState: false,
            emailID: emailID,
            accountID: acid
          }
          res.json(resultMsg);
        });

    }

  });

  /**
   * 이메일 체크
   */
  app.get('/sendEmailCheck', function (req, res) {
    var id = req.query['id'];
    var pw = req.query['pw'];


    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: id,
        pass: pw
      }
    }));

    var mailOptions = {
      from: id,
      to: id,
      subject: '[Flexible User License Cloud Version] Email authentication',
      text: 'Google Mail authentication is complete.',
      // html: "<h1>Testing flex</h1>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        logger.error('sendMail error' + error);
        var resultMsg = {
          code: 400,
          msg: error
        }
        res.json(resultMsg);
      } else {
        logger.info('Email sent: ' + info.response);
        const key = 'flexsalt';
        const pwEnc = emailCrypto('enc',pw, key);
        var resultfailMsg = {
          code: 200,
          msg: 'Email sent: ' + info.response,
          pwEnc:pwEnc
        }
        res.json(resultfailMsg);
      }
    });


  });

  app.get('/orgApiKeySave', function (req, res) {

    var orgKey = req.query['orgApikey'];
    var acid = req.query['acid'];
    var orgState = 200;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + orgKey);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://api.atlassian.com/users/" + acid + "/manage/profile", requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        if (result.code === 401) {
          orgState = 401;
        }
        if (result.key === 'forbidden') {
          orgState = 500;
        }
        var resultMsg = {
          orgkeyState: orgState,
          reqType: 'orgKey',
        }
        res.json(resultMsg);
      }).catch(error => {
        orgState = 400;
        var resultMsg = {
          orgkeyState: orgState,
          reqType: 'orgKey',
        }
        res.json(resultMsg);
        logger.error('error' + error);
      });
  });


  app.get('/adminTokenSave', function (req, res) {

    var token = req.query['context-token'];
    var adminToken = req.query['adminApiToken'];
    var orgKey = req.query['orgApikey'];
    var acid = req.query['acid'];
    var adminKeyState = 200;

    verifiedclaims(token, jwt, addon, getSettingInfo);

    function getSettingInfo(data) {
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + orgKey);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      console.log('acid', acid);
      fetch("https://api.atlassian.com/users/" + acid + "/manage/profile", requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(result);
          console.log("result.account.email",result.account.email);
          var emailID = result.account.email !== undefined ? result.account.email : "";

          var myHeaders = new Headers();
          var basicKey = emailID + ':' + adminToken;
          myHeaders.append('Authorization', `Basic ${Buffer.from(
            basicKey).toString('base64')}`);
          myHeaders.append("Content-Type", "application/json");


          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          fetch(baseUrl + "/rest/api/3/user?accountId=" + acid, requestOptions)
            .then(response => response.text())
            .then(result => {
              result = JSON.parse(result);
              if (result.accountId === acid) {
                adminKeyState = 200;
              } else {
                adminKeyState = 400;
              }

              var resultMsg = {
                adminKeyState: adminKeyState,
                reqType: 'adminKey',
                emailID: emailID,
                accountID: acid
              }
              res.json(resultMsg);

            })
            .catch(error => {
              logger.error('error' + error);
              var resultMsg = {
                adminKeyState: 400,
                reqType: 'adminKey',
                emailID: emailID,
                accountID: acid
              }
              res.json(resultMsg);
            });
        })
        .catch(error => {
          logger.error('error' + error);
          var resultMsg = {
            adminKeyState: 400,
            reqType: 'adminKey'
          }
          res.json(resultMsg);
        });
    }
  });

  /**
   * 강제삭제 대상 체크
   */
  app.get('/removeForceUserCheck', function (req, res) {

    var token = req.query['context-token'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];
    var targetGroup = req.query['targetGroup'];

    /**
     * 애드온 환경 설정 정보 가저오기 jwt 토큰을 사용하여 애드온 세팅 정보 취득
     */
    verifiedclaims(token, jwt, addon, getSttinginfo);

    function getSttinginfo(data) {
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      var basicAuth = adminID + ':' + adminApiToken;
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      console.log('targetGroup', targetGroup);
      fetch(baseUrl + "/rest/api/3/group/member?groupname=" + targetGroup, requestOptions)
        .then(response => response.text())
        .then(result => {
          var canuseInfo = JSON.parse(result);
          res.json(canuseInfo);
        })
        .catch(error => logger.error('removeForceUserCheck error : ', error));
    }
  });

  /**
   * 라이선스 그룹 강제 삭제
   */
  app.get('/removeForceUser', function (req, response) {
    var token = req.query['context-token'];
    var count = req.query['count'];
    var orgApiKey = req.query['orgApiKey'];
    var adminID = req.query['adminID'];
    var adminApiToken = req.query['adminApiToken'];
    var targetGroup = req.query['targetGroup'];

    /**
     * 애드온 환경 설정 정보 가저오기 jwt 토큰을 사용하여 애드온 세팅 정보 취득
     */
    verifiedclaims(token, jwt, addon, getSttinginfo);

    function getSttinginfo(data) {
      var resultMsg = {};
      var removeUserlist = [];
      let baseUrl = data.baseUrl;
      var myHeaders = new Headers();
      var basicAuth = adminID + ':' + adminApiToken;
      myHeaders.append('Authorization', `Basic ${Buffer.from(
        basicAuth).toString('base64')}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(baseUrl + "/rest/api/3/group/member?groupname=" + targetGroup, requestOptions)
        .then(response => response.text())
        .then(result => {
          var content = JSON.parse(result);

          if (content.total < count || content.total < -1) {
            resultMsg = {
              resultCode: '99',
              resultMsg: 'exceed'
            }
          } else {
            getOrgId(orgApiKey, _setOrginfo);

            function _setOrginfo(res) {
              var Orginfo = JSON.parse(res);
              if(Orginfo.data[0] === undefined){
                var removeInfo = {
                  resultCode: '99',
                  resultMsg: 'fail',
                  count: 0,
                  users: 0,
                }
                return response.json(removeInfo);
              }
              var orgId = Orginfo.data[0].id;
              getLicUserInfo(orgApiKey, orgId, setLicUserInfo);

              function setLicUserInfo(res) {

                if (count >= content.total) count = content.total;
                var cnt = Number(content.total) - Number(count);

                content.values.forEach(function (licUser) {
                  res.forEach(function (allUser) {
                    if (licUser.accountId === allUser.accountID) {
                      removeUserlist.push(allUser);
                    }
                  });
                });

                var field = 'last_active';
                removeUserlist = removeUserlist.sort(function (a, b) { // 오름차순
                  return a[field] - b[field];
                  // 13, 21, 25, 44
                });
                var removeUsers = [];
                for (var i = 0; i < cnt; i++) {
                  if (removeUserlist.length > 0) {
                    removeUsers.push(removeUserlist[i].accountID);
                    removeLicenseUser(removeUserlist[i].accountID);
                  }
                }

                resultMsg = {
                  resultCode: '00',
                  resultMsg: 'sucess',
                  count: removeUsers.length,
                  users: removeUsers,
                }
                response.json(resultMsg);
              }

            }
          }
        })
        .catch(error => logger.error('error' + error));


      function removeLicenseUser(accountId) {
        var removeUrl = baseUrl + '/rest/api/3/group/user?groupname=' + targetGroup + '&accountId=' + accountId;
        var basicAuth = adminID + ':' + adminApiToken;
        var myHeaders = new Headers();
        myHeaders.append('Authorization', `Basic ${Buffer.from(
          basicAuth).toString('base64')}`);
        myHeaders.append('Accept', 'application/json');

        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(removeUrl, requestOptions)
          .then(response => {
            console.log(
              `Response: ${response.status} ${response.statusText}`
            );
          })
          .then(result => result)
          .catch(error => error);
      }
      function getOrgId(orgApiKey, callback) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + orgApiKey);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("https://api.atlassian.com/admin/v1/orgs", requestOptions)
          .then(response => response.text())
          .then(result => {
            callback(result)
          })
          .catch(error => {
            logger.error('error' + error);
            callback(error);
          });
      }

      function getLicUserInfo(orgKey, orgId, callback) {

        var licUserList = [];
        getAllMember(orgKey, orgId, setRemoveMembers);

        function setRemoveMembers(userinfo) {
          for (let idx in userinfo) {
            var removeUser = new Object();
            removeUser.last_active = getLastActiveTime(userinfo[idx].last_active);
            removeUser.name = userinfo[idx].name;
            removeUser.accountID = userinfo[idx].account_id;
            licUserList.push(removeUser);
          }
          callback(licUserList);
        }


        function getLastActiveTime(lastActive) {
          // eslint-disable-next-line use-isnan
          return lastActive === undefined ? new Date().getTime() : new Date(lastActive).getTime();
        }


        function getAllMember(orgKey, orgId, callback) {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer " + orgKey);

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          fetch("https://api.atlassian.com/admin/v1/orgs/" + orgId + "/users", requestOptions)
            .then(response => response.text())
            .then(result => {
              var userMember = JSON.parse(result);
              if (userMember.links.next !== undefined) {
                getCursorAllMember(userMember.links.next, orgKey, _setCursorAllMember);

                function _setCursorAllMember(res) {
                  var nextMember = JSON.parse(res);
                  userMember = userMember.data.concat(nextMember.data);
                  if (nextMember.links.next !== undefined) {
                    getCursorAllMember(nextMember.links.next, _setCursorAllMember);
                  } else {
                    callback(userMember);
                  }
                }
              } else {
                callback(userMember);
              }

            })
            .catch(error => logger.error('getAllMember error : ', error));
        }

        function getCursorAllMember(url, orgKey, callback) {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer " + orgKey);

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
              callback(result)
            })
            .catch(error => logger.error('getCursorAllMember error : ', error));
        }
      }
    }

  });



  /**
   * webhook 로그인 이벤트 리스너
   */
  app.get('/webhook_login', addon.authenticate(), (req, res) => {
    // app.get('/init', (req, res) => {
    // Rendering a template is easy; the render method takes two params:
    // name of template and a json object to pass thse context in.

    //console.log('hook', res);

    res.render('index', {
      title: 'Flexible User License'
      //issueId: req.query['issueId']
    });
  });


  /** Controller Other  import  */
  {
    let fs = require('fs');
    let path = require('path');
    let files = fs.readdirSync("routes");
    for (let index in files) {
      let file = files[index];
      if (file === "index.js") continue;
      // skip non-javascript files
      if (path.extname(file) != ".js") continue;

      let routes = require("./" + path.basename(file));
      console.log('routes', routes);
      if (typeof routes === "function") {
        routes(app, addon);
      }
    }
  }
}
