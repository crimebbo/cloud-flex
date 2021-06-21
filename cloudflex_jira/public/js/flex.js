// TODO: 그룹할당 확인 실시간 검색으로 변경 할것


// eslint-disable-next-line no-undef
Vue.config.delimiters = ['${', '}'];
Vue.config.devtools = true;
// Vue.config.disableNoTranslationWarning = true;


// util
var isNumber = function (val) {
  return /^[0-9]+$/.test(val);
};

var createChart = function (data) {
  // eslint-disable-next-line no-undef
  return bb.generate({
    bindto: data.el,
    data: {
      columns: data.columns,
      type: 'donut'
    },
    tooltip: {
      format: {
        name: function (name, ratio, id, index) { return name; },
        value: function (value, ratio, id, index) { return Math.round(ratio * 100) + '%' }
      }
    },
    donut: {
      title: data.title,
      label: {
        ratio: 1,
        format: function (value, ratio, id) {
          return Math.round(ratio * 100) + '%';
        }
      }
    },
    legend: {
      show: false
    },
    size: {
      width: 200,
      height: 200
    }
  });
};


// eslint-disable-next-line no-undef
var i18n = new VueI18n({
  locale: 'ko_KR',
  fallbackLocale: 'en_US',
  messages: {
    en_US: en,
    ko_KR: ko
  },
  silentTranslationWarn: true
});

// 요약
// chart component
Vue.component('comp-chart', {
  props: ['type', 'title', 'info', 'list', 'unit'],
  data: function () {
    return {
      isShow: false
    }
  },
  computed: {
    stateChartClass: function () {
      return 'chart-wrap--' + this.type;
    },
    chartInfoClass: function () {
      return 'flx-info-call-out--' + this.type;
    }
  },
  methods: {
    // 요약 차트 인포 show/hide
    toggleInfoCallout: function (isShow) {
      this.isShow = isShow;
    },
  },
  template: '#chart-template'
});

// 요약 - 그룹 설정
Vue.component('comp-summary-group-mapping', {
  props: ['info'],
  data: function () {
    return {

    }
  },
  computed: {
    groupMappingClass: function () {
      return this.info.type === 'license' ? 'flx-category--' + this.info.type : '';
    }
  },
  template: '#summary-group'
});


// eslint-disable-next-line no-undef
var flx = new Vue({
  el: '#flx',
  i18n: i18n,
  data: {
    isExpired: false,
    isSetGroup: false,
    isSetAPI: false,
    currentLang: 'ko_KR',
    lang: ['ko_KR', 'en_US'], // temp data
    currentTab: 'intro',
    summary: [
      { used: 0, remain: 0 },
      { used: 0, remain: 0 },
    ],
    group: {
      isEditGroup: false, // 그룹 설정 편집인지
      isSpinner: false, // true / false
      isSettingWarning: false,
      list: [],
      info: [
        {
          type: 'user',
          label: 'dashboard.userGroup',
          desc: 'group.descUserGroup',
          hasInputVal: true,
          isCorrect: true,
          showUserLen: false,
          list: [],
          groupName: '',
          newName: '',
          warningMessage: '',
          count: 0,
          day: '',
          name: ''
        },
        {
          type: 'license',
          label: 'dashboard.licenseGroup',
          desc: 'group.descLicence',
          hasInputVal: true,
          isCorrect: true,
          showUserLen: false,
          list: [],
          groupName: '',
          newName: '',
          warningMessage: '',
          count: 0,
          day: '',
          name: ''
        }
      ],
      findUserName: '', // 그룹할당 확인 사용자 이름 
      assign: [], // 그룹 할당 데이터 변수 생성 [true, true],
      isPending: false,
      userList: [],
      finduserNameList: [],
      findUserAccountID: ''
    },
    schedule: {
      isSpinner: false,
      isEdit: false,
      isCorrectDate: true,
      isCorrectUserNum: true,
      isFullfield: true,
      isSpecifyGroup: true,
      showUserCount: false,
      userCount: 1,
      groupList: [],
      removeUserCnt: 0,
      licenseGroupCnt: 0,
      groupName: ''
    },
    scheduleOption: [
      { value: 1, name: 'daily' },
      { value: 7, name: 'weekly' },
      { value: 30, name: 'monthly' }
    ],
    force: {
      userCount: 1,
      caution: ''
    },
    flexConfig: {
      isComplete: false,
      isEdit: false,
      orgApiKey: '',
      adminID: '',
      adminApiToken: '',
      authAdminEmail_id: '',
      // authAdminEmail_pw: '',
      warnorgApiKey: '',
      warnToken: '',
      warnEmail: '',
      warnPw: '',
      isShowPwTxt: false,
      isActiveAPI: false,
      isActiveToken: false,
      isActiveEmail: false,
      isApiLoading: false,
      isTokenLoading: false,
      isEmailLoading: false,
      ynAuthDomain: 'N',
      isDisplaySMTPInput: false,
      showPasswordDisplay:false
    },
    entityService: null,
    currentTime: Format.getTimeStamp()
  },
  created: function () {
    this.entityService = flexEntity.entityService();
    this.group.isSpinner = true;
    // data 설정값
    this.getinitLicenseConfig();

    this.setPageLang();

    // 전체 그룹 리스트 가져오기
    this.setGroupList();
  },
  computed: {
    displaySettingWarning: function () { 
      return this.group.isSettingWarning;
    },
    activateUserState: function () {
      return this.group.finduserNameList[0];
    },
    passwordType: function () {
      return this.flexConfig.isShowPwTxt ? 'text' : 'password';
    },
    startInfoUrl: function () {

      var url = 'https://osci.atlassian.net/wiki/spaces/FUL/pages/';
      return url += this.currentLang === 'ko_KR' ? '614367252/Jira' : '614957057/English+Manual+Jira';
    },
    isSetAll: function () {
      return this.isSetGroup && this.isSetAPI;
    },
    whereDoIGo: function () {
      if (!this.isSetAPI) {
        return 'api';
      } else if (!this.isSetGroup) {
        return 'group';
      }
      return;
    },
    displayAPIPwIcon: function () {
      return this.flexConfig.isShowPwTxt ? 'aui-iconfont-watch-filled' : 'aui-iconfont-new-watch';
    },
    activateStatus: function () {
      if (this.entityService.licenseEntity.deactiveEnabled) {
        return i18n.locale === 'ko_KR' ? '활성화' : 'enabled';
      } else {
        return i18n.locale === 'ko_KR' ? '비활성화' : 'disabled';
      }
    },
    isActiveAutoRemovePanen: function () {
      return this.entityService.licenseEntity.deactiveEnabled;
    },
    // 요약 (남은 사용자 수)
    remainCount: function () {
      var licenseEntity = this.entityService.licenseEntity;
      var boardEntity = this.entityService.boardEntity;

      return licenseEntity.countCanuseGroup ? (licenseEntity.countCanuseGroup - boardEntity.removeUsersCount) : 0;
    },
    //요약 : 자동삭제 시작시간
    startTime: function () {
      var licenseEntity = this.entityService.licenseEntity;
      var interval = licenseEntity.deactiveScheduleHour;
      var result = 0;

      if (interval) {
        result = interval < 10 ? '0' + interval : interval;
      } else {
        result = 24;
      }

      return result + ':00';
    },
    // 그룹할당 확인 - 사용자 그룹
    isAssignedUserGroup: function () {
      return this.group.assign[0] ? 'aui-iconfont-check-circle-filled flx-ico-success' : 'aui-iconfont-cross-circle flx-ico-fail';
    },
    isAssignedLicenseGroup: function () {
      return this.group.assign[1] ? 'aui-iconfont-check-circle-filled flx-ico-success' : 'aui-iconfont-cross-circle flx-ico-fail';
    },
    isEditUserAssign: function () {
      var groupInfo = this.group.info;

      return groupInfo.every(function (info) {
        return !info.groupName.length;
      });
    }
  },
  filters: {
    time: function (val) {
      var strVal = val + ':00';

      return val < 10 ? '0' + strVal : strVal;
    }
  },
  methods: {
    onTouchStart: function (e) {
      e.preventDefault();
      var licenseEntity = this.entityService.licenseEntity;

      if (licenseEntity.sourceGroup === 'N') {
        AJS.tabs.change($('.flx-tab a[href=#group]')); return;
      }
      if (licenseEntity.notiLimit === 0 || licenseEntity.notiGroup === '') {
        AJS.tabs.change($('.flx-tab a[href=#auto]')); return;
      }

    },
    onclickRefresh: function () {
      this.group.isSpinner = true;
      this.getLicenseInfo();
    },

    setGroupInfo: function (licenseEntity) {
      // entityService의 licenseGroup, userGroup 값을 data안에서 분리
      var getGroupName = function (groupVal) {
        return groupVal.length && groupVal === 'N' ? '' : groupVal;
      };

      this.group.info[0].groupName = getGroupName(licenseEntity.sourceGroup);
      this.group.info[0].count = this.entityService.userGroup.count;
      this.group.info[0].day = this.entityService.userGroup.day;
      this.group.info[0].name = this.entityService.userGroup.name;

      this.group.info[1].groupName = getGroupName(licenseEntity.targetGroup);
      this.group.info[1].count = this.entityService.licenseGroup.count;
      this.group.info[1].day = this.entityService.licenseGroup.day;
      this.group.info[1].name = this.entityService.licenseGroup.name;

      this.isSetGroup = licenseEntity.sourceGroup !== 'N' && licenseEntity.targetGroup !== 'N' ? true : false;

      this.setCurrentTab();
      //대시보드 탭 관련 속성  세팅 및 제어
      this.ctrlDashBoard(licenseEntity);
      var config = this.entityService.config;
      // confluence 라이선스 정보 매핑한다.
      if (config.ynAuthDomain === 'Y' && config.adminApiToken !== '' && config.authAdminEmail_id !== '') {
        /**
         * 컨플런스 라이선스 정보
         */
        flexAP.getWikiLicenseInfo(config, this._setWikiLicenseInfo);
        /**
         * 서버 재구동시 스케쥴러 동작 체크
         */
        if (licenseEntity.deactiveEnabled && licenseEntity.notiGroup !== '' && licenseEntity.sourceGroup !== 'N') {
          this.regScheduler('auto');
        }
      }
    },
    _resCheckOrgApiKey: function (res) {
      // console.log('_resCheckOrgApiKey', res);
      if (res.code === 401) {
        this.isExpired = true;
      }
      var lastDays = this.entityService.licenseEntity.lastLogin;
      var config = this.entityService.config;
      var targetGroup = this.entityService.licenseEntity.targetGroup;
      flexAP.getLastActive(lastDays, config, targetGroup, this._settingRemoveUser);
    },
    _settingRemoveUser: function (res) {
      this.entityService.boardEntity.removeUsersCount = res.removeCnt;
      this.entityService.licenseEntity.countCanuseGroup = res.licGroupSize;
      this.group.isSpinner = false;
    },
    showGroupUserLen: function (group) {
      // 그룹설정 사용자 인원 및 시간 보기
      var config = this.entityService.config;
      if (Validate.isNotEmpty(group.groupName)) {
        if (group.type === 'user') {
          flexAP.getGroupMembers(group.groupName, config, this.setshowGroupUserLen);
        }
        else {
          flexAP.getGroupMembers(group.groupName, config, this.setshowGroupLicenseLen);
        }
      } else {
        if (group.type === 'user') {
          this.ctrlUserState(0, 0);
        } else {
          this.ctrlUserState(1, 0);
        }
      }

    },
    setshowGroupUserLen: function (data) {

      var result = data.values.filter(function (results, i) {
        return results.accountType === 'atlassian';
      });
      this.ctrlUserState(0, result.length);

    },
    setshowGroupLicenseLen: function (data) {
      var result = data.values.filter(function (results, i) {
        return results.accountType === 'atlassian';
      });
      this.ctrlUserState(1, result.length);
    },
    goToPage: function (e) {
      // console.log(e);
      e.preventDefault();
      var tagName = e.target.tagName.toLowerCase();
      var tabName = '';

      tabName = tagName === 'button' ? '#' + e.target.getAttribute('data-locname') : e.target.getAttribute('href');

      if (tabName === '#api') {
        this.isExpired = false;
      }

      this.currentTab = tabName.replace('#', '');
      AJS.tabs.change($('.flx-tab a[href="' + tabName + '"]'));
      // console.log(tabName);
    },
    setHelpTabStatus: function (e) {
      e.preventDefault();
      this.currentTab = e.target.hash.replace('#', '').trim();
      this.group.userList = [];
      this.group.findUserName = '';

      this.onGroupEdit(false);
      this.editSchedulePanel(false);
    },
    handleGroupAutoComplete: function (val) {
      // 그룹설정 자동 완성 toggle
      // FIXME: 자동삭제에서도 사용 할수 있도록 나중에 수정 할 것
      this.group.info.forEach(function (data, idx) {
        if (data.type === val.type) data.isShowGroupList = val.isShow;
      });
    },
    // 그룹 설정 자동완성 버튼 클릭
    onSelectGroup: function (name, type) {
      var groups = this.group;
      groups.info.forEach(function (currentGroup) {

        if (currentGroup.type === type) {
          currentGroup.newName = name || '';
        }

        currentGroup.list = [];
      });
    },
    onSelectNotigroup: function (name) {
      // this.entityService.licenseEntity.notiGroup = name;
      this.schedule.groupName = name;
      this.schedule.groupList = [];
    },
    onSelectUserNm: function (item) {
      // console.log(item);
      this.group.finduserNameList = [];
      if (!('name' in item)) {
        this.group.finduserNameList.push(item);
      }
      this.group.findUserName = item.publicName;
      this.group.userList = [];
    },
    // 그룹 설정 그룹 이름 set
    customClickGroupName: function (data) {
      this.group.info.forEach(function (info, idx) {
        if (info.type === data.type) {
          info.newName = data.value;
        }
      });
    },
    setGroupList: function () {
      var that = this;
      flexAP.getGroups(function (data) {
        that.group.list = data.groups;
      });
    },
    resetGroupMapping: function () {
      this.group.isEditGroup = false;

      this.group.info.forEach(function (info, idx) {
        info.newName = '';
        info.isCorrect = true;
        info.warningMessage = '';
      });
    },
    // 그룹 설정 : 저장
    onSubmitGroupName: function () {

      var groups = this.group.info;
      var rootLicenseEntity = this.entityService.licenseEntity;
      var that = this;
      console.log('groups', groups);
      var isCorrectGroupName = function (name) {
        return that.group.list.filter(function (item) {
          return item.name === name;
        }).length ? true : false;
      };

      var displayWarning = function (group, msg) {
        group.warningMessage = 'cautions.' + msg;
        group.list = [];
        group.isCorrect = false;
      };

      if (!groups[0].groupName && !groups[1].groupName) {

        groups.forEach(function (group) {
          if (!group.newName.length) {
            displayWarning(group, 'groupName');
          } else {
            group.isCorrect = true;
          }
        });


        groups.forEach(function (g) {
          if (g.newName.length && !isCorrectGroupName(g.newName)) {
            displayWarning(g, 'invalidGroup');
          } else if (g.newName.length && isCorrectGroupName(g.newName)) {
            g.isCorrect = true;
          }
        });

        if (groups[0].newName.length && groups[1].newName.length && groups[0].newName === groups[1].newName) {
          groups.forEach(function (group) {
            displayWarning(group, 'mustDiff');
          });
          return;
        } else if (groups[0].newName.length && groups[1].newName.length && groups[0].newName !== groups[1].newName) {
          groups.forEach(function (group) {
            group.isCorrect = true;
          });
        }
      }


      if (groups[0].groupName && groups[1].groupName) {

        if (!groups[0].newName.length && !groups[1].newName.length) {
          this.resetGroupMapping();
          return;
        } // if

        if (groups[0].newName === groups[1].newName) {
          groups.forEach(function (group) {
            displayWarning(group, 'mustDiff');
          });
          return;
        } // if

        if (groups[0].newName && !groups[1].newName.length) {

          if (groups[0].newName === groups[1].groupName) {
            displayWarning(groups[0], 'mustDiff');
            return;
          } else {
            groups[0].isCorrect = true;
          } // if /else

          if (!isCorrectGroupName(groups[0].newName)) {
            displayWarning(groups[0], 'invalidGroup');
          } else {
            rootLicenseEntity.sourceGroup = groups[0].newName;
            this.resetGroupMapping();
            this.updateLicenses();
          }
          return;
        } // if (group0 && !group1)

        if (!groups[0].newName.length && groups[1].newName) {

          if (groups[1].newName === groups[0].groupName) {
            displayWarning(groups[1], 'mustDiff');
            return;
          } else {
            groups[1].isCorrect = true;
          }

          if (!isCorrectGroupName(groups[1].newName)) {
            displayWarning(groups[1], 'invalidGroup');
          } else {
            rootLicenseEntity.targetGroup = groups[1].newName;
            this.resetGroupMapping();
            this.updateLicenses();
          }

          return;
        } // if

        if (groups[0].newName !== groups[1].newName) {
          groups.forEach(function (g) {
            if (!isCorrectGroupName(g.newName)) {
              displayWarning(g, 'invalidGroup');
            } else {
              g.isCorrect = true;
            }
          });
        } // if
      } // groups[0].groupName && groups[1].groupName

      // 저장하기
      if (groups[0].isCorrect && groups[1].isCorrect) {

        rootLicenseEntity.sourceGroup = groups[0].newName;
        rootLicenseEntity.targetGroup = groups[1].newName;

        this.resetGroupMapping();
        this.updateLicenses();
      }
    },
    onGroupEdit: function (bType) {
      // 그룹 설정 편집
      var group = this.group;
      var groupInfos = group.info;
      this.group.userList = [];
      this.group.findUserName = '';
      this.group.isEditGroup = bType;

      groupInfos.forEach(function (group, idx) {
        if (bType) {
          group.showUserLen = false;
        } else {
          group.isCorrect = true;
          group.list = [];
          group.newName = '';
        }
      });
    },
    filterGroupName: function (e) {
      var that = this;
      var target = e.target;
      var type = target.getAttribute('data-type');
      var groupIndex = null;

      var filterGroup = function () {
        if (!target.value) return false;
        return that.group.list.filter(function (item, idx) {
          return item.name.indexOf(target.value) > -1;
        });
      };

      this.group.info.forEach(function (group, idx) {
        if (group.type === type) {
          group.newName = target.value;
          groupIndex = idx;
        }
      });

      if (filterGroup()) {
        if (this.group.info[groupIndex].newName.length > 1) {
          this.group.info[groupIndex].list = filterGroup();
        } else {
          this.group.info[groupIndex].list = [];
        }
      } else {
        this.group.info[groupIndex].list = [{ name: null }];
      }
    },
    filterScheduleGroup: function (e) {
      var that = this;
      var target = e.target;
      var notigroupField = this.schedule.groupName;

      var filterGroup = function () {
        if (!target.value) return false;
        return that.group.list.filter(function (item, idx) {
          return item.name.indexOf(target.value) > -1;
        });
      };

      if (filterGroup()) {
        if (notigroupField.length > 1) {
          this.schedule.groupList = filterGroup();
        } else {
          this.schedule.groupList = [];
        }
      } else {
        this.schedule.groupList = [{ name: null }];
      }

    },
    filterUserName: _.debounce(function () {
      var userGroup = this.group.info[0].groupName;
      var licenseGroup = this.group.info[1].groupName;
      var config = this.entityService.config;
      // if (this.group.findUserName.length < 1) return;

      flexAP.getGroupTotalMembers(userGroup, licenseGroup, config, this._setGroupTotalMembers);
    }, 200),

    /**
     * 대시보드 유저 그룹과 라이선스 그룹 멤버수 조회
     */
    getDashBoardUserCount: function (licenseEntity) {
      var userGroup = licenseEntity.sourceGroup;
      var lieGroup = licenseEntity.targetGroup;
      var config = this.entityService.config;
      flexAP.getDashboardMemberCount(userGroup, lieGroup, config, this.setDashboardMemberCount);
    },
    setDashboardMemberCount: function (data) {
      // console.log('setDashboardMemberCount', data);
      if (data.status !== 400) {
        this.group.info[0].count = data[0].size;
        this.group.info[1].count = data[1].size;
      }
    },
    /**
     * 최초 라이선스 정보 가저오기테스트
     */
    getLicenseInfo: function () {
      const url = flexApiUrl.getLicenseState();
      let type = 'GET';
      flexAP.callApi(url, type, '', this.setLicenseInfo);
    },
    /**
     * licenseEntity 라이선스 객체 등록
     * @param data
     */
    setLicenseInfo: function (data) {
      // data.value 가 없을 경우 기본 값으로 설정 한다.
      this.entityService = data.value || flexEntity.entityService();

      // console.log(this.entityService.licenseEntity);
      // group.info 값 설정
      // getInitLicenseConfig()가 비동기 되어 데이터가 
      // 바로 처리되지 않아서 setLicneseInfo에서 호출
      this.setGroupInfo(this.entityService.licenseEntity);
      // api data setting
      this.setAPIInfo(this.entityService.config);
    },
    setAPIInfo: function (data) {
      console.log('setAPIInfo');
      this.flexConfig.adminApiToken = data.adminApiToken;
      this.flexConfig.orgApiKey = data.orgApiKey;
      this.flexConfig.authAdminEmail_id = data.authAdminEmail_id;
      this.flexConfig.authAdminEmail_pw = data.authAdminEmail_pw;

      this.isSetAPI = data.adminApiToken && data.orgApiKey && data.authAdminEmail_id && data.authAdminEmail_pw ? true : false;
      this.setCurrentTab();
    },
    /**
     *  데이터 업데이트 샘플
     */
    updateLicenses: function () {
      // console.log('updateLicense');
      const url = flexApiUrl.updateLicense();
      let type = 'PUT';

      flexAP.callApi(url, type, this.entityService, this.initEntity);
    },
    /**
     * 라이선스 객체 삭제하기
     */
    removeLicense: function () {
      const url = flexApiUrl.removeLicenseState();
      let type = 'DELETE';
      flexAP.callApi(url, type, '', this.initEntity);

    },
    /**
     * 최초 서비스 설치시 라이선스  설정 정보 저장
     */
    getinitLicenseConfig: function () {
      flexAP.callApi(flexApiUrl.getLicenseState(), 'GET', '', this.setLicenseConfig);
    },
    /**
     * 최초 api 호출후 404 리턴시 라이선스 관련 DB 없다고 판단 하고 최초 데이터 저장 후 라이선스 정보 가저오기
     * @param data
     */
    setLicenseConfig: function (data) {
      // console.log('setLicenseConfig');
      if (!Validate.isEmpty(data)) {
        if (data.status === 404) {
          const url = flexApiUrl.updateLicense();
          let type = 'PUT';
          flexAP.callApi(url, type, flexEntity.initEntity(), this.initEntity);
        } else {
          this.getLicenseInfo();
        }
      }
    },
    initEntity: function (data) {
      if (data['status-code'] === 200) {
        var flag = AP.flag.create({
          title: i18n.messages[this.currentLang].alert.saveGroup,
          body: '',
          type: 'success',
          close:'auto'
        });
      }
      this.getLicenseInfo();
    },
    setPageLang: function () {
      // html lang속성, i18n lang 속성 설정
      flexAP.getLocale(this._setLang);

    },
    _setLang: function (lang) {
      // 비지니스 로직은  '_'로 시작
      // i18n locale, html lang 값 설정
      // ko_KR, en_US
      // ko를 제외한 나머지 언어 설정시 en_US로 나타남

      // console.log('setLeng: ', lang);

      this.currentLang = lang !== 'ko_KR' ? 'en_US' : lang;

      var setI18nLang = function (lang) {
        i18n.locale = lang;
      };

      var setDocumentLang = function (lang) {
        document.documentElement.setAttribute('lang', lang);
      };

      setI18nLang(lang);
      setDocumentLang(lang);
    },
    changeLang: function (lang) {
      // TODO: temp 국영문 완료 후 삭제 예정
      // console.log('changeLang: ', lang);
      this._setLang(lang);
      // console.log(lan);
    },
    displayChart: function () {
      var currentLang = this.currentLang && (this.currentLang === 'ko_KR') ? '무제한' : 'Unlimited';

      //License Usage
      var licenseTitle = this.entityService.boardEntity.maximumNumberOfUsers === -1 ? currentLang : this.entityService.boardEntity.maximumNumberOfUsers;
      var licUsers = this.entityService.boardEntity.maximumNumberOfUsers === -1 ? 0 : this.entityService.boardEntity.countLicense;
      var lsRemain = this.entityService.boardEntity.maximumNumberOfUsers === -1 ? 100 : Number(this.entityService.boardEntity.maximumNumberOfUsers) - Number(licUsers);

      //Registered Users
      var registerTitle = this.entityService.boardEntity.countRegisterUsers;
      var regLsUser = this.entityService.boardEntity.countLicense;
      var regUnLsUsers = Number(this.entityService.boardEntity.countRegisterUsers) - Number(this.entityService.boardEntity.countLicense);

      var colorLicense = {
        'Licensed Users': '#000965',
        'Licensed Remained': '#bbcdef'
      };

      var colorRegister = {
        'Licensed Users': '#000965',
        'Unlicensed Users': '#bbcdef'
      };

      createChart({
        el: '#chart-license',
        title: String(licenseTitle),
        columns: [
          ["Licensed Users", licUsers],
          ["Licensed Remained", lsRemain]
        ]
      }).data.colors(colorLicense);

      createChart({
        el: '#chart-register',
        title: String(registerTitle),
        columns: [
          ["Licensed Users", regLsUser],
          ["Unlicensed Users", regUnLsUsers]
        ]
      }).data.colors(colorRegister);


      this.summary = [
        {
          used: this.entityService.boardEntity.countLicense,
          remain: lsRemain === 100 ? currentLang : lsRemain
        },
        {
          used: regLsUser,
          remain: regUnLsUsers
        }
      ];
      /**
       * api key 유효기간 체크
       */
      flexAP.checkOrgApiKey(this.entityService.config, this._resCheckOrgApiKey);
    },
    handleFlag: function (info) {
      // console.log('handleFlag: ', i18n.messages[this.currentLang].alert.saveGroup);
      var flag = AP.flag.create({
        title: info.title,
        // body: 'This is a flag.',
        type: info.type,
        // actions: {
        //   'actionkey': 'Click me'
        // }
      });
      // this.updateLicenses();

      setTimeout(function () {
        flag.close();
      }, 1500);
    },
    activeAutoRemovePanel: function (val) {
      // this.schedule.statusOnOffAutoremovePanel = val;
      this.entityService.licenseEntity.deactiveEnabled = val;
      this.updateLicenses();
    },
    CQL: function () {
      flexAP.CQL(this.setCQL);
    },
    setCQL: function (data) {
      console.log('setCQL', data);
    },
    /**
     *  현재 로그인한 유저 정보 조회
     */
    getCurrentUser: function () {
      flexAP.getCurrentUser(this.setCurrentUser);
    },
    setCurrentUser: function (data) {
      console.log('setCurrentUser', data);
    },

    /**
     *   유저 정보 조회
     */
    getUserinfo: function () {
      let accountId = '5deda7197dc0360ecd01fbde';
      flexAP.getEmail(accountId, this.setUserinfo);
    },
    setUserinfo: function (data) {
      console.log('getEmail', data);
    },
    /**
     *  그룹 정보 조회
     */
    getGroups: function () {
      flexAP.getGroups(this.setGroups);
    },
    setGroups: function (data) {
      console.log('setGroups', data);
    },
    /**
     *  해당 그룹에 유저 추가
     */
    addMemberToGroup: function (e) {
      e.preventDefault();
      this.group.isPending = true;
      var licenseEntity = this.entityService.licenseEntity;
      let licenseGroup = licenseEntity.targetGroup;
      let accountid = this.group.findUserAccountID;
      var config = this.entityService.config;
      flexAP.addMemberToGroup(accountid, licenseGroup, config, this.setaddMemberToGroup);
    },
    setaddMemberToGroup: function (res) {
      //response.status: 201 성공  400 : 실패
      this.group.isPending = false;

      var newAssignval = this.group.assign.slice();
      if (res['response.status'] === 201) {
        newAssignval[1] = true;
        this.group.assign = newAssignval;
      }
    },
    /**
     *  해당 그룹에 유저 삭제
     */
    removeMemberToGroup: function (e) {
      e.preventDefault();
      this.group.isPending = true;
      var licenseEntity = this.entityService.licenseEntity;
      let licenseGroup = licenseEntity.targetGroup;
      let accountid = this.group.findUserAccountID;
      var config = this.entityService.config;
      flexAP.removeMemberToGroup(accountid, licenseGroup, config, this.setremoveMemberToGroup);
    },
    setremoveMemberToGroup: function (res) {
      //response.status: 200 성공  500 : 실패

      this.group.isPending = false;
      var newAssignval = this.group.assign.slice();
      if (res['response.status'] === 200) {
        newAssignval[1] = false;
        this.group.assign = newAssignval;
      }
    },
    /**
     * 그룹에 속한 유저정보 상세 조회
     */
    getGroupMember: function () {
      let groupname = 'canuse-wiki';
      flexAP.getGroupMember(groupname, this.setGroupMember);
    },
    setGroupMember: function (data) {
      console.log('setGroupMember', data);
    },
    _setGroupTotalMembers: function (data) {
      // console.log('setGroupTogalMembers', data);
      var that = this;
      var non_duplicated = Validate.getUniqueObjectArray(data);
      // console.log(non_duplicated);

      if (!this.group.findUserName.length) {
        this.group.userList = [{ name: null }];
        return;
      }

      var result = non_duplicated.filter(function (user) {
        return user.publicName.indexOf(that.group.findUserName) > -1;
      });

      // console.log(result.length);


      this.group.userList = result.length ? result : [{ name: null }];
    },
    ctrlDashBoard: function (licenseEntity) {
      // 대시보드 유저 카운트
      if (licenseEntity.sourceGroup !== 'N')
        this.getDashBoardUserCount(licenseEntity);

      // 대시 보드 세팅 경고 메시지 제어
       if (licenseEntity.sourceGroup === 'N' || licenseEntity.notiLimit === 0 || licenseEntity.notiGroup === '') {
        this.group.isSettingWarning = true;
      } else if (licenseEntity.sourceGroup !== 'N' && licenseEntity.notiLimit !== 0 && licenseEntity.notiGroup) {
        this.group.isSettingWarning = false;
      }
    },
    /**
     * 유저 상태 조회
     */
    onTouchChekuser: function () {
      var licenseEntity = this.entityService.licenseEntity;
      let g1 = licenseEntity.sourceGroup;
      let g2 = licenseEntity.targetGroup;
      var config = this.entityService.config;

      this.group.isPending = true;

      flexAP.getGroupMemberState(g1, g2, config, this._setGroupMemberState);

    },
    _setGroupMemberState: function (data) {
      var findUser = this.group.findUserName;

      var hasGroup = function (group) {
        return group.filter(function (result) {
          return result.publicName === findUser;
        }).length ? true : false;
      };

      var group = data.sourceGroup.concat(data.targetGroup);
      var getAccoutID = group.filter(function (result) {
        return result.publicName === findUser;
      });
      this.group.findUserAccountID = getAccoutID[0].accountId;
      this.group.isPending = false;
      this.group.assign = [hasGroup(data.sourceGroup), hasGroup(data.targetGroup)];

    },
    _setWikiLicenseInfo: function (lic) {
      this.entityService.boardEntity.countLicense = lic.jiraLicUseCnt;
      this.entityService.boardEntity.maximumNumberOfUsers = lic.jiraLicMaxUser
      var config = this.entityService.config;
      if (config.ynAuthDomain === 'Y') {
        flexAP.getAllMemberCount(config, this._setAllMemberCount);
      }
    },
    _setAllMemberCount: function (data) {
      var users = data.results.filter(function (results, i) {
        return results.accountType === 'atlassian';
      });
      this.entityService.boardEntity.countRegisterUsers = users.length;

      /**
       * 차트를 그린다.
       */
      this.displayChart();
    },
    ctrlUserState: function (num, cnt) {
      this.group.info[num].count = cnt;
      this.group.info[num].showUserLen = true;
      this.group.info[num].day = Format.getTimeStamp();
    },
    // auto remove
    editSchedulePanel: function (val) {
      var schedule = this.schedule;

      schedule.isEdit = val;

      if (!val) {
        schedule.isCorrectDate = true;
        schedule.isCorrectUserNum = true;
        schedule.isFullfield = true;
        schedule.isSpecifyGroup = true;
        schedule.groupName = '';
        schedule.groupList = [];
      }

    },
    submitSchedule: function (e) {
      e.preventDefault();
      var groups = this.group.info;
      var that = this;

      var isCorrectGroupName = function (name) {
        return that.group.list.filter(function (item) {
          return item.name === name;
        }).length ? true : false;
      };

      var schedule = this.schedule;
      var isAllCorrect = true;

      schedule.showUserCount = false;

      // lastlogin
      schedule.isCorrectDate = isNumber(this.entityService.licenseEntity.lastLogin);
      isAllCorrect = schedule.isCorrectDate;

      // user count
      schedule.isCorrectUserNum = isNumber(this.entityService.licenseEntity.notiLimit) && this.entityService.licenseEntity.notiLimit > 0;
      isAllCorrect = schedule.isCorrectUserNum;

      var notiGroup = this.entityService.licenseEntity.notiGroup;
      // group
      if(!notiGroup && !schedule.groupName){
        schedule.isFullfield = schedule.groupName ? true : false;
        isAllCorrect = schedule.isFullfield ? true : false;
      }


      if (!isCorrectGroupName(schedule.groupName) && schedule.groupName) {
        schedule.groupList = [];
        schedule.isSpecifyGroup = false;
        isAllCorrect = false;
      }

      if (!isAllCorrect) return;
      //Auto Remove & Notification Setting 저장
      if(schedule.groupName){
        this.entityService.licenseEntity.notiGroup = schedule.groupName;
      }

      const url = flexApiUrl.updateLicense();
      let type = 'PUT';
      flexAP.callApi(url, type, this.entityService, this.regScheduler);

    },
    showConfirm: function () {
      var forceData = this.force;
      var adminID = this.entityService.config.adminID;
      var adminApiToken = this.entityService.config.adminApiToken;
      var targetGroup = this.entityService.licenseEntity.targetGroup;

      if (!isNumber(forceData.userCount)) {
        forceData.caution = 'invalidenum';
        return;
      }
      flexAP.removeForceUserCheck(forceData.userCount, adminID, adminApiToken, targetGroup, this._removeForceUserCheck);

    },
    _removeForceUserCheck: function (res) {
      var forceData = this.force;

      if (Number(res.total) <= Number(forceData.userCount)) {
        forceData.caution = 'doNotExceed';
        return;
      } else {
        AJS.dialog2("#member-user-count-dialog").show();
        forceData.caution = '';
        return;
      }
    },
    cancelForce: function () {
      AJS.dialog2("#member-user-count-dialog").hide();
    },
    submitForce: function () {
      // TODO: 
      // license 수 초과시 경고에 넣을 값은 'doNotExceed' 입니다.
      var forceData = this.force;
      var config = this.entityService.config;
      var targetGroup = this.entityService.licenseEntity.targetGroup;
      flexAP.removeForceUser(forceData.userCount, config, targetGroup, this._resRemoveForceUser);

    },
    _resRemoveForceUser: function (data) {
      // console.log('res', data);
      if (data.resultCode === '00' || data.resultCode === '99') {
        var flag = AP.flag.create({
          title: i18n.messages[this.currentLang].alert.removeForce,
          body: '',
          type: 'success',
          close:'auto'
        });
        AJS.dialog2("#member-user-count-dialog").hide();
      }
    },
    regScheduler: function (actionType) {
      //스케쥴러 등록
      var config = this.entityService.config;
      flexAP.setSchedulerService(this.entityService.licenseEntity.deactiveScheduleHour,
        this.entityService.licenseEntity.deactiveScheduleInterval,
        this.entityService.licenseEntity.deactiveEnabled, config, actionType,this.currentLang,
        this._resultRegScheduler);
    },
    _resultRegScheduler: function (data) {
      var schedule = this.schedule;

      if (data === '200') {
        console.log('here');
        var flag = AP.flag.create({
          title: i18n.messages[this.currentLang].alert.saveSchedule,
          body: '',
          type: 'success',
          close:'auto'
        });
        setTimeout(function () { 
          flag.close();
        }, 1000);
        schedule.isEdit = false;
        schedule.isSpecifyGroup = true;
        this.group.isSettingWarning = false;
      }
    },
    displayRemoveUserDesc: function (e) {
      // 자동삭제 탭 / 구성원 수 확인
      e.preventDefault();
      // 로딩바 
      this.schedule.isSpinner = true;

      var lastDays = this.entityService.licenseEntity.lastLogin;
      var config = this.entityService.config;
      var targetGroup = this.entityService.licenseEntity.targetGroup;
      flexAP.getLastActive(lastDays, config, targetGroup, this._setLastActive);
    },
    _setLastActive: function (data) {
      this.schedule.removeUserCnt = data.removeCnt;
      this.schedule.licenseGroupCnt = data.licGroupSize - data.removeCnt;
      this.schedule.showUserCount = true;
      this.schedule.isSpinner = false;
    },

    editConfigPanel: function (name) {
      var entityConfig = this.entityService.config;
      var flexConfig = this.flexConfig;

      if (name === 'email') {

        entityConfig.authAdminEmail_id = flexConfig.authAdminEmail_id ? flexConfig.authAdminEmail_id : '';
        // entityConfig.authAdminEmail_pw = flexConfig.authAdminEmail_pw.length ? flexConfig.authAdminEmail_pw : '';
        flexConfig.isActiveEmail = false;
        flexConfig.isShowPwTxt = false;
        flexConfig.isDisplaySMTPInput = false;
      }
      else {
        entityConfig[name] = flexConfig[name] ? flexConfig[name] : '';

        if (name === 'orgApiKey') {
          flexConfig.isActiveAPI = false;
        } else if (name === 'adminApiToken') {
          flexConfig.isActiveToken = false;
        }
      }

      this.flexConfig['warn' + name] = '';
    },
    onClickSendEmailSave: function (e) {
      var flxConfig = this.flexConfig;
      var entityConfig = this.entityService.config;

      if (Validate.isEmpty(entityConfig.authAdminEmail_id)) {
        flxConfig.warnEmail = 'warnEmailInsert';
      } else if (!Validate.isEmpty(entityConfig.authAdminEmail_id) && !Validate.isEMailAddr(entityConfig.authAdminEmail_id)) {
        flxConfig.warnEmail = 'warnEmail';
      } else {
        flxConfig.warnEmail = '';
      }

      flxConfig.warnPw = Validate.isEmpty(entityConfig.authAdminEmail_pw) ? 'warnPwInsert' : '';

      if (Validate.isNotEmpty(flxConfig.warnEmail) || Validate.isNotEmpty(flxConfig.warnPw)) return;

      flxConfig.isEmailLoading = true;
      flxConfig.isShowPwTxt = false;
      flxConfig.isDisplaySMTPInput = false;
      flexAP.SendEmailCheck(entityConfig.authAdminEmail_id, entityConfig.authAdminEmail_pw, this._SendEmailCheck);
    },
    _SendEmailCheck: function (res) {
      var flxConfig = this.flexConfig;
      // console.log('res', res);
      flxConfig.isEmailLoading = false;

      if (res.code === 200) {
        var pwEnc = res.pwEnc;
        var conf = this.entityService.config;
        conf.authAdminEmail_pw = pwEnc;

        const url = flexApiUrl.updateLicense();
        let type = 'PUT';
        flexAP.callApi(url, type, this.entityService, this._configSaveResult);

        flxConfig.isActiveEmail = false;
        flxConfig.authAdminEmail_id = this.entityService.config.authAdminEmail_id;
        flxConfig.showPasswordDisplay = false;
        this.isSetAPI = conf.adminApiToken && conf.orgApiKey && conf.authAdminEmail_id && conf.authAdminEmail_pw ? true : false;
        // flxConfig.authAdminEmail_pw = this.entityService.config.authAdminEmail_pw;
      } else {
        flxConfig.warnEmail = 'warnEmail';
        flxConfig.warnPw = 'warnPw';
        flxConfig.showPasswordDisplay = true;
        return;
      }
    },
    /**
     * 조직 apk key 등록
     */
    onclickOrgApiKeySave: function (e) {
      e.preventDefault();
      var config = this.flexConfig;
      config.isApiLoading = true;
      flexAP.orgApiKeySave(this.entityService.config.orgApiKey, this._configSaveOrgKey);
    },
    _configSaveOrgKey: function (res) {
      var status = res.orgkeyState;
      var flexConfig = this.flexConfig;

      if (status === 200) {
        this.entityService.config.ynAuthDomain = 'Y';
        const url = flexApiUrl.updateLicense();
        let type = 'PUT';
        flexAP.callApi(url, type, this.entityService, this._configSaveResult);
        this.flexConfig.orgApiKey = this.entityService.config.orgApiKey;
        this.flexConfig.warnorgApiKey = '';
        this.flexConfig.ynAuthDomain = 'Y';
        this.flexConfig.isActiveAPI = false;
      } else if (status === 401) {
        /* TODO:
            warnWrong: '잘못된 API 키 입니다.',
            warnDomain: '도메인 인증이 필요합니다.',
            warnAdmin: '관리자 API 키를 입력해야 합니다.',
        위 세의의 키중 하나의 키를 아래의 property의 값으르 넣으면 됩니다.
        */
        flexConfig.warnorgApiKey = 'warnWrong';
      }
      else if (status === 500) {
        /* TODO:
            warnWrong: '잘못된 API 키 입니다.',
            warnDomain: '도메인 인증이 필요합니다.',
            warnAdmin: '관리자 API 키를 입력해야 합니다.',
        위 세의의 키중 하나의 키를 아래의 property의 값으르 넣으면 됩니다.
        */
        this.flexConfig.warnorgApiKey = 'warnDomain';
      }
      flexConfig.isApiLoading = false;
    },
    /**
     * admin api token  저장
     * @param e
     */
    onclickAdminApiTokenSave: function (e) {
      e.preventDefault();
      var config = this.flexConfig;
      config.isTokenLoading = true;
      config.adminApiToken = this.entityService.config.adminApiToken;
      config.orgApiKey = this.entityService.config.orgApiKey;

      flexAP.adminApiTokenSave(config.adminApiToken, config.orgApiKey, this._configSaveApiToken)
    },
    _configSaveApiToken: function (res) {
      // console.log('res',res);
      if (res.adminKeyState === 200) {
        this.entityService.config.adminID = res.emailID;
        const url = flexApiUrl.updateLicense();
        let type = 'PUT';
        flexAP.callApi(url, type, this.entityService, this._configSaveResult);
        this.flexConfig.isActiveToken = false;
      }
      this.flexConfig.isTokenLoading = false;
    },
    _configSaveResult: function (data) {
      var config = this.flexConfig;
      console.log('data', data);
      if (data['status-code'] === 200) {
        var flag = AP.flag.create({
          title: i18n.messages[this.currentLang].alert.saveConfig,
          body: '',
          type: 'success',
          close:'auto'
        });
        config.isEdit = false;
      }
    },
    togglePw: function () {
      this.flexConfig.isShowPwTxt = !this.flexConfig.isShowPwTxt;
    },
    setCurrentTab: function () {
      // set Group info
      // set Api info 에서 각각 호출
      // 현재 세팅이 되었는지 확인 하여 intro 화면 활성/비활성화 하기
      // created일 경우 설정 되었는지 바로 확인이 되지 않아 데이터를 설정 할때 호출함
      this.currentTab = (this.isSetAPI && this.isSetGroup) ? 'summary' : 'intro';
    },
    activeConfigBtn: function (type) {
      var currentFieldName = 'isActive' + type;
      this.flexConfig[currentFieldName] = true;
    },
    hideModal: function () {
      this.isExpired = false;
    },
    pwCheckEvent : function () {
      var flexConfig = this.flexConfig;
      if(!flexConfig.isDisplaySMTPInput){
        flexConfig.showPasswordDisplay = true;
        this.entityService.config.authAdminEmail_pw = '';
      }else{
        flexConfig.showPasswordDisplay = false;
      }

    }
  }
});

