
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';

export default function TakePhotoScreen() {
  const handleTakePhoto = () => {
    Alert.alert('提示', '拍照功能开发中，敬请期待！');
  };

  const handleSelectFromGallery = () => {
    Alert.alert('提示', '相册选择功能开发中，敬请期待！');
  };

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: '拍照记录',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />

      <View style={styles.container}>
        <View style={styles.content}>
          <IconSymbol name="camera" size={80} color={colors.primary + '60'} />
          <Text style={styles.title}>记录植物成长</Text>
          <Text style={styles.subtitle}>
            拍摄照片记录植物的成长历程，创建专属的成长相册
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.primaryButton} onPress={handleTakePhoto}>
              <IconSymbol name="camera" size={20} color="white" />
              <Text style={styles.primaryButtonText}>拍摄照片</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleSelectFromGallery}>
              <IconSymbol name="photo" size={20} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>从相册选择</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
