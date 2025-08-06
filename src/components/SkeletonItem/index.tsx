import React from 'react';
import { View, StyleSheet } from 'react-native';

export function SkeletonItem() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View style={styles.textBlockContainer}>
        <View style={styles.textBlock} />
        <View style={styles.textBlockSmall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    height: 40,
    marginRight: 16,
    width: 40,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 4,
    padding: 16,
  },
  textBlock: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    height: 16,
    marginBottom: 8,
    width: '80%',
  },
  textBlockContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textBlockSmall: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    height: 12,
    width: '60%',
  },
});
