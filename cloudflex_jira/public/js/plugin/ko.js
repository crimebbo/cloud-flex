var ko = {
  tabs: {
    summary: '요약',
    group: '그룹 설정',
    auto: '자동 삭제 및 알림',
    force: '강제 삭제',
    api: '환경 설정'
  },
  edit: '편집',
  cautions: {
    invalidenum: '유효한 숫자를 입력해야 합니다.',
    groupName: '그룹 이름을 입력해야 합니다.',
    mustDiff: '사용자 그룹과 라이선스 그룹은 서로 다른 그룹으로 설정해야 합니다.',
    invalidGroup: '유효한 그룹을 지정해야 합니다.',
    deactivateAutoRemove: '자동 삭제 및 알림 기능이 현재 <em>비활성화</em> 되어 있습니다.',
    doNotExceed: '라이선스 그룹의 사용자 수를 초과하는 숫자는 입력할 수 없습니다.'
  },
  alert: {
    saveGroup: '그룹설정이 저장되었습니다.',
    saveSchedule: '스케쥴 설정이 저장되었습니다.',
    removeForce: '사용자 강제삭제 기능이 적용되었습니다.',
    saveConfig: '환경설정 정보가 저장 되었습니다.'
  },
  units: {
    licenseUsed: '사용 라이선스',
    licenseRemain: '남은 라이선스',
    registLicense: '라이선스 사용자',
    registUnLicense: '라이선스 미사용자',
    users1: '명',
    users2: '명',
    dayago: '일 전',
    dayago2: '일 전'
  },
  placeholder: {
    inputNum: '숫자 입력',
    findGroup: '그룹 찾기',
    findName: '사용자 이름 찾기',
    none: '일치하는 항목 없음',
    assign: '할당됨',
    unAssign: '할당되지 않음'

  },
  btns: {
    introStart: '시작하기',
    introGuide: '시작 안내서',
    setNow: '지금 설정',
    refresh: '새로고침',
    save: '저장',
    cancel: '취소',
    on: '켜짐',
    off: '꺼짐',
    runNow: '바로 실행'
  },
  intro: {
    tit: 'Flexible User License에 오신 것을 환영합니다.',
    titSub: 'Flexible User License 시작을 위한 사전 필수 및 설정',
    listTit1: '1. 제품 액세스',
    item1: 'Flexible User License 시작을 위해 사전에 제품 액세스 설정이 필요합니다.',
    listTit2: '2. 환경 설정',
    item2: '도메인 인증 단계를 거친 후, API 정보와 SMTP 메일 서버 정보를 확인합니다.',
    listTit3: '3. 그룹 설정',
    item3: 'Flexible User License를 실행하여 ‘사용자 그룹’과 ‘라이선스 그룹’을 설정합니다.',
    listTit4: '4. 자동 삭제 및 알림',
    item4: 'Flexible User License 작동을 위해 사용자 자동 삭제 및 알림을 설정합니다.'
  },
  dashboard: {
    warningMsg: '‘자동 삭제 및 알림’ 설정이 아직 완료되지 않았습니다. 설정을 완료 해 주세요.',
    chartTitle: {
      license: '라이선스 사용량',
      user: '사용자 수'
    },
    licenseInfo: '구매한 License의 정보입니다. <br /> 사용/미사용 라이선스 수를 표시합니다.',
    registeredInfo: '등록된 사용자 수의 정보입니다. 라이선스가 부여된 사용자와, 부여되지 않은 사용자의 수를 표시합니다.',
    groupTit: '그룹 설정',
    userGroup: '사용자 그룹',
    noGroup: '적용된 그룹 없음',
    licenseGroup: '라이선스 그룹',
    autoTit: '자동 삭제 및 알림',
    delLicenseTit: '라이선스 그룹에서 삭제',
    loginDate: '마지막 활동 날짜',
    tobeRemoved: '삭제 예정',
    remain: '남은 사용자 수',
    emailNotiTit: '이메일 알림',
    userLen: '사용자 수',
    notiGroup: '알림 그룹',
    schedule: '자동 삭제 및 알림 스케줄 설정',
    startTime: '시작 시간',
    interval: '간격'
  },
  group: {
    warnimg: 'Flexible User License를 사용하려면 사용자 그룹과 라이선스 그룹으로 사용할 그룹을 설정해야 합니다. 그룹을 설정한 후에 ‘구성원 수 확인’ 버튼을 클릭하면 그룹의 구성원 수를 확인할 수 있습니다',
    desc: 'Flexible User License를 사용하려면 사용자 그룹과 라이선스 그룹으로 사용할 그룹을 설정해야 합니다. 그룹을 설정한 후에 ‘구성원 수 확인’ 버튼을 클릭하면 그룹의 구성원 수를 확인할 수 있습니다.',
    descUserGroup: '모든 사용자를 포함하는 그룹으로, 라이선스가 할당된 그룹은 아닙니다.',
    descLicence: '라이선스가 할당된 그룹으로, 그룹의 구성원 전체가 라이선스를 가집니다.',
    checkCount: '구성원 수 확인',
    licenseGroup: '라이선스 그룹',
    groupConfirm: '그룹 할당 확인',
    groupConfirmDesc: '각 사용자별 사용자 그룹과 라이선스 그룹에 대한 할당 여부를 확인할 수 있으며, 라이선스 그룹에 사용자를 추가 또는 제거할 수 있습니다.',
    userName: '사용자 이름',
    checkUserState: '사용자 상태 확인',
    userStateDesc: '‘사용자 상태 확인’ 버튼을 클릭하여 사용자 그룹과 라이선스 그룹 그룹의 할당 여부를 확인할 수 있습니다.',
    table: {
      titUser: '사용자',
      titName: '사용자 이름',
      titGroup1: '사용자 그룹',
      titGroup2: '라이선스 그룹',
      titAction: '작업',
      notFound: '사용자를 찾을 수 없음',
      remove: '라이선스 그룹에서 제거',
      add: '라이선스 그룹에 추가'

    }

  },
  autoRemove: {
    warning: '‘자동 삭제 및 알림’ 기능을 사용하기 위해서는  사전에 그룹 설정 탭의 라이선스 그룹 설정이 필요합니다.',
    titRemoveLicense: '라이선스 그룹에서 제거',
    titEmail: '이메일 알림',
    titSchedule: '자동 삭제 및 알림 스케줄 설정',
    desclicense: '라이선스 그룹의 사용자 중 지정된 일수 이상 활동기록이 없으면 라이선스 그룹에서 자동으로 삭제됩니다.',
    labelLastLogin: '마지막 활동 날짜',
    labelUserCount: '사용자 수',
    labelNotif: '설정 그룹',
    labelStartTime: '시작 시간',
    labelInterval: '간격',
    descemail: '라이선스 그룹의 사용자 수가 지정된 수 이상인 경우 지정된 그룹의 사용자에게 이메일 알림을 발송합니다.',
    descschedule: '‘라이선스 그룹에서 제거’와 ‘이메일 알림’의 시작 시간과 주기를 설정합니다.',
    daily: '일간',
    weekly: '주간',
    monthly: '월간'
  },
  force: {
    tit: '라이선스 그룹에서 강제 삭제',
    warning: ' ‘강제 삭제’ 기능을 사용하기 위해서는  사전에 그룹 설정 탭의 라이선스 그룹 설정이 필요합니다.',
    desc: '라이선스 그룹의 사용자 수를 지정된 수로 즉시 조정할 수 있습니다.',
    descInfo: '마지막으로 활동한 날짜가 가장 오래된 사용자부터 순차적으로 삭제됩니다.',
    label: '사용자 수 설정 (그룹 내)',
    modalTit: '사용자 강제 삭제'
  },
  setting: {
    titApi: '정보',
    titSMTP: '메일 서버',
    desc: 'SMTP 메일 서버는 Flexible User License 앱에 대한 이메일 알림을 전송할 때 사용됩니다. G Suite 또는 구글 계정으로 인증이 가능합니다.',
    labelAdminApi: '관리자 API 키',
    labelToken: 'API 토큰',
    email: '이메일',
    pw: '비밀번호',
    placeApiKey: '관리자 API 키 입력',
    placeToken: 'API 토큰 입력',
    placePw: '비밀번호 입력',
    warnWrong: '잘못된 API 키 입니다.',
    warnDomain: '도메인 인증이 필요합니다.',
    warnAdmin: '관리자 API 키를 입력해야 합니다.',
    warnToken: '잘못된 API 토큰 입니다.',
    warnInsertToken: 'API 토큰을 입력해야 합니다.',
    warnEmail: '잘못된 이메일 형식 입니다.',
    warnEmailInsert: '이메일을 입력해야 합니다.',
    warnPw: '잘못된 비밀번호 입니다.',
    warnPwInsert: '비밀번호를 입력해야 합니다.',
    showPw: '비밀번호 입력'
  },
  help: {
    tit: '도움말',
    desc: 'Flexible User License는 라이선스 그룹의 사용자 수를 유연하게 관리하여 사용자 수 증감에 효과적으로 대응할 수 있습니다.',
    href: 'https://osci.atlassian.net/wiki/spaces/FUL/pages/614367252/Jira',
    hrefTxt: 'Flexible User License에 대해 더 보기'
  }
};