let flexEntity = {
};

/**
 * 최초 라이선스 데이터
 * @returns {{lastLogin: number, countCanuseGroup: number, deactiveEnabled: boolean, targetGroup: string, sourceGroup: string, deactiveScheduleInterval: number, countSourceGroup: number, notiGroup: string, notiLimit: number, deactiveScheduleHour: number, userLimit: number, countCanuseDate: string, countSourceDate: string}}
 */
let resultData = new Object();
flexEntity.initEntity = function () {

  resultData.licenseEntity = {
    'userLimit': 9999,
    'notiLimit': 0,
    'lastLogin': 0,
    'deactiveScheduleHour': 1,
    'countCanuseDate': '',
    'countCanuseGroup': 0,
    'countSourceDate': '',
    'countSourceGroup': 0,
    'deactiveEnabled': false,
    'deactiveScheduleInterval': 1,
    'notiGroup': '',
    'sourceGroup': 'N',
    'targetGroup': 'N'
  };
  resultData.boardEntity = {
    'countLicense': 0,
    'countRegisterUsers': 0,
    'removeUsersCount': 0,
    'maximumNumberOfUsers': ''

  };

  resultData.licenseGroup = {
    'count': 0,
    'day': '',
    'name': '',
  };

  resultData.userGroup = {
    'count': 0,
    'day': '',
    'name': '',
  };

  resultData.config = {
    'orgApiKey': '',
    'adminID': '',
    'adminApiToken': '',
    'authAdminEmail_id': '',
    'authAdminEmail_pw': '',
    'ynAuthDomain':'N'
  };

  return resultData;
}

flexEntity.entityService = function () {
  const assign = Object.assign({}, flexEntity.initEntity());
  return assign;

}
