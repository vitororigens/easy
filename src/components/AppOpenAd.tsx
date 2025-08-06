import { useEffect } from 'react';
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';

export const AppOpenAdComponent = () => {
  useEffect(() => {
    let appOpenAd: AppOpenAd | null = null;

    const loadAd = async () => {
      try {
        appOpenAd = await AppOpenAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });

        appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
          appOpenAd?.show();
        });

        appOpenAd.load();
      } catch (error) {
        console.log('Erro ao carregar App Open Ad:', error);
      }
    };

    loadAd();

    return () => {
      if (appOpenAd) {
        appOpenAd.removeAllListeners();
      }
    };
  }, []);

  return null;
};
