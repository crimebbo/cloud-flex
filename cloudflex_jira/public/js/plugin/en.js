var en = {
  tabs: {
    summary: 'Summary',
    group: 'Group Mapping',
    auto: 'Auto Remove & Notification',
    force: 'Force Remove',
    api: 'Configuration'
  },
  edit: 'Edit',
  cautions: {
    invalidenum: 'You must specify a number.',
    groupName: 'You must enter a group',
    mustDiff: 'User Group and Licensed Group must be set up as different group.',
    invalidGroup: 'You must specify a valid group.',
    deactivateAutoRemove: 'Turn on the <em>‘Auto Remove & Notification’</em> function to view detail',
    doNotExceed: 'You must not enter numbers that exceed the Licensed Group user count.'
  },
  alert: {
    saveGroup: 'Group mapping has been saved.',
    saveSchedule: 'Schedule mapping has been saved.',
    removeForce: 'User force remove function applied.',
    saveConfig: 'Config mapping has been saved.'
  },
  units: {
    licenseUsed: 'Used',
    licenseRemain: 'Remain',
    registLicense: 'Licensed',
    registUnLicense: 'Unlicensed',
    users1: 'Users',
    users2: 'User(s)',
    dayago: 'days ago',
    dayago2: 'Day(s) ago'
  },
  placeholder: {
    inputNum: 'Enter number',
    findGroup: 'Search by group',
    findName: 'Search by name',
    none: 'No Matches',
    assign: 'Assigned',
    unAssign: 'Unassigned'
  },
  btns: {
    introStart: 'Get Started',
    introGuide: 'Getting Started Guide',
    setNow: 'Start Now',
    refresh: 'Refresh',
    save: 'Save',
    cancel: 'Cancel',
    on: 'On',
    off: 'Off',
    runNow: 'Run Now'
  },
  intro: {
    tit: 'Welcome to Flexible User License!',
    titSub: 'Preset for Starting the Flexible User License',
    listTit1: '1. Product Access',
    item1: 'Set the Product Access in advance in order to start Flexible User License.',
    listTit2: '2. Configuration',
    item2: 'After the domain verification, check API and SMTP mail server information.',
    listTit3: '3. Group Mapping',
    item3: 'After starting Flexible User License, set values for \'User Groups\' and \'License Groups\'.',
    listTit4: '4. Auto Remove & Notification',
    item4: 'Set the value in the Auto Remove & Notification menu to run Flexible User License.'
  },
  dashboard: {
    warningMsg: 'Flexible User License setting is not completed yet. Please finish the setting.',
    chartTitle: {
      license: 'License Usage',
      user: 'Registered Users'
    },
    licenseInfo: 'License Usage menu shows the information of purchased license.<br /> You can check the number of Used/ Remaining licenses.',
    registeredInfo: 'User Count menu shows the information about the number of registered users. <br />You can check the number of Licensed/ Unlicensed users.',
    groupTit: 'Group mapping',
    userGroup: 'User Group',
    noGroup: 'No group applied',
    licenseGroup: 'Licensed Group',
    autoTit: 'Auto Remove & Notification',
    delLicenseTit: 'Remove from Licensed Group',
    loginDate: 'Last Active',
    tobeRemoved: 'To be removed',
    remain: 'To remain',
    emailNotiTit: 'Email Notification',
    userLen: 'User Count',
    notiGroup: 'Notification group',
    schedule: 'Schedule',
    startTime: 'Start Time',
    interval: 'Interval'
  },
  group: {
    warning: 'Not yet',
    desc: 'Set the groups to User Group and/or License Group to use Flexible User License. ‘Check User Count’ button to see the number of users in the group.',
    descUserGroup: 'A group that includes all users, but not neccessarily the group to which licenses are assigned.',
    descLicence: 'A group to which licenses are assigned and all members of the group have licenses.',
    checkCount: 'Check User Count',
    licenseGroup: 'Licensed Group',
    groupConfirm: 'Check Group Assignment',
    groupConfirmDesc: 'Check whether the user is assigned to User Group or Licensed Group(Or to both).Freely Add or remove the users to/ from Licensed.',
    userName: 'User name',
    checkUserState: 'Check User State',
    userStateDesc: 'Click ‘Check User State’ and see whether the user is assigned to User Group or Licensed Group(Or to both).',
    table: {
      titUser: 'User',
      titName: 'Username',
      titGroup1: 'User Group',
      titGroup2: 'Licensed Group',
      titAction: 'Action',
      notFound: 'No user found',
      remove: 'Remove from Licensed Group',
      add: 'Add to Licensed Group'
    }
  },
  autoRemove: {
    warning: 'The ‘Auto Remove & Notification’ feature requires the ‘Licensed Group’ setting on ‘Group Setting’ menu in advance.',
    titRemoveLicense: 'Remove from Licensed Group',
    titEmail: 'Email Notification',
    titSchedule: 'Schedule for Auto Remove & Notification',
    desclicense: 'Users who have no activity records for the set period of time will automatically be removed from Licensed Group.',
    labelLastLogin: 'Last Active',
    labelUserCount: 'User Count',
    labelNotif: 'Notification Group',
    labelStartTime: 'Start Time',
    labelInterval: 'Interval',
    descemail: 'Once the number of users in Licensed group exceeds the maximum user count, the Notification Group users shown below will receive email notification.',
    descschedule: 'Set the start time and the interval of the ‘Remove from Licensed Group’ and ‘Email Notification’ functions.',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
  },
  force: {
    tit: 'Force Remove User from Licensed Group',
    warning: 'The \'Force Remove\' feature requires the \'Licensed Group\' setting on \'Group Setting\' menu in advance.',
    desc: 'Make an immediate adjustment to the number of users in the Licensed Group to the wanted number.',
    descInfo: 'It will remove users from whom has the oldest active date.',
    label: 'Set User Number',
    modalTit: 'Force Remove User'
  },
  setting: {
    titApi: 'Info',
    titSMTP: 'Mail Server',
    labelAdminApi: 'Admin API Key',
    labelToken: 'API Token',
    email: 'Email',
    pw: 'Password',
    placeApiKey: 'Enter Admin API Key',
    placeToken: 'Enter API Token',
    placePw: 'Enter Password',
    warnWrong: 'You must enter valid Admin API Key.',
    warnDomain: 'Domain Verification is required.',
    warnAdmin: 'You must enter Admin API Key.',
    warnToken: ' You must enter valid API Token.',
    warnInsertToken: ' You must enter API Token.',
    warnEmail: ' You must enter valid email format.',
    warnEmailInsert: ' You must enter email address.',
    warnPw: ' You must enter valid password.',
    warnPwInsert: ' You must enter password.',
    showPw: 'Enter Password'
  },
  help: {
    tit: 'Help Tip',
    desc: 'Flexible User License solves the license shortage issue by flexibly managing the user count of the licensed group.',
    href: 'https://osci.atlassian.net/wiki/spaces/FUL/pages/614957057/English+Manual+Jira',
    hrefTxt: 'Learn more about Flexible User License'
  }
};