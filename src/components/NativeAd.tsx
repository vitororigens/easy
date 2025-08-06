import React, { useEffect, useState } from 'react';
import { NativeAd, TestIds, NativeAdView } from 'react-native-google-mobile-ads';
import { View, StyleSheet, Text, Image } from 'react-native';

const adUnitId = __DEV__ ? TestIds.NATIVE : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';

interface NativeAdProps {
  style?: any;
}

export const NativeAdComponent: React.FC<NativeAdProps> = ({ style }) => {
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    NativeAd.createForAdRequest(adUnitId)
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={[styles.container, style]}>
      <View style={styles.content}>
        {nativeAd.icon ? (
          <Image
            source={{ uri: String(nativeAd.icon) }}
            style={styles.icon}
          />
        ) : (
          <View style={[styles.icon, styles.placeholderIcon]} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{nativeAd.headline}</Text>
          {nativeAd.advertiser && (
            <Text style={styles.advertiser}>{nativeAd.advertiser}</Text>
          )}
        </View>
      </View>
      {nativeAd.callToAction && (
        <Text style={styles.callToAction}>{nativeAd.callToAction}</Text>
      )}
    </NativeAdView>
  );
};

const styles = StyleSheet.create({
  advertiser: {
    color: '#666',
    fontSize: 14,
  },
  callToAction: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    color: '#fff',
    marginTop: 10,
    overflow: 'hidden',
    padding: 8,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 10,
    padding: 10,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  placeholderIcon: {
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
});
