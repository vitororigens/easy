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
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderIcon: {
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  advertiser: {
    fontSize: 14,
    color: '#666',
  },
  callToAction: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#007AFF',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
