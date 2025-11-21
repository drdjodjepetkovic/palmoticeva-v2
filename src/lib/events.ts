
/**
 * @fileoverview Central registry for all user-facing events.
 * This file defines the types and payloads for the event bus system,
 * ensuring consistency and type safety across the application.
 */

export enum UserEventType {
  // Gamification
  BadgeUnlocked = 'badge:unlocked',

  // PWA & Onboarding
  PwaInstallPrompt = 'pwa:install_prompt',
  WalkthroughStart = 'walkthrough:start',
  WalkthroughComplete = 'walkthrough:complete',

  // Notifications
  NotificationPermissionRequest = 'notification:permission_request',
  ToastShow = 'notification:toast_show',

  // User Actions & Profile
  AppointmentInquirySent = 'user:appointment_inquiry_sent',
  FirstCycleLogged = 'user:first_cycle_logged',
  CycleLogged = 'user:cycle_logged',
  ShareApp = 'user:share_app',
  RateApp = 'user:rate_app',
}

// Defines the data structure for each event's payload.
export type UserEventPayload = {
  [UserEventType.BadgeUnlocked]: { badgeKey: string };
  [UserEventType.PwaInstallPrompt]: {};
  [UserEventType.WalkthroughStart]: {};
  [UserEventType.WalkthroughComplete]: {};
  [UserEventType.NotificationPermissionRequest]: {};
  [UserEventType.ToastShow]: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  };
  [UserEventType.AppointmentInquirySent]: {};
  [UserEventType.FirstCycleLogged]: {};
  [UserEventType.ShareApp]: {};
  [UserEventType.RateApp]: {};
  [UserEventType.CycleLogged]: { date: string };
};
