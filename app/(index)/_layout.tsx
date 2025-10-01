
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function AppIndexLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: '植物照料',
        }}
      />
    </Stack>
  );
}
