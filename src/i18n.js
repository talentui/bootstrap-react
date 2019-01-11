import I18NTools from '@beisen/i18n-tools';
import appConfig from '_/src/app-config';
const { i18n = {} } = appConfig;

export default function(kickoff) {
  const { BSGlobal = {} } = window;
  const { I18NInfo } = BSGlobal;
  if (I18NInfo) {
    window.I18NTools = I18NTools;
    I18NTools.appInit({
      lng: i18n.lng || I18NInfo.I18NUserLang,
      i18nSite: i18n.host || I18NInfo.I18NFrontEndHost,
      versions: function() {
        var version = {};
        version[I18NInfo.I18NUserLang] = I18NInfo.I18NVersion;
        return version;
      },
      application: i18n.app,
      platform: i18n.platform,
      namespaces: i18n.ns,
      callback: function() {
        kickoff();
      }
    });
    return;
  }
  kickoff();
}
