
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { ReminderSettings as ReminderSettingsType } from '@/types/user';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

const defaultSettings: ReminderSettingsType = {
  nextPeriod: { enabled: true, daysBefore: 3 },
  fertileWindow: { enabled: true, daysBefore: 1 },
  ovulation: { enabled: true, daysBefore: 1 },
};

export function ReminderSettings({ t }: { t: (key: string) => string }) {
  const { user, userProfile, setUserProfile } = useAuth(); 
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<ReminderSettingsType>(
    userProfile?.reminderSettings || defaultSettings
  );

  useEffect(() => {
    // This effect ensures the component's state is synced if the profile loads/changes.
    if (userProfile?.reminderSettings) {
      setSettings(userProfile.reminderSettings);
    }
  }, [userProfile?.reminderSettings]);


  const handleSettingChange = useCallback(async (
    key: keyof ReminderSettingsType,
    field: 'enabled' | 'daysBefore',
    value: boolean | number
  ) => {
    if (!user || !userProfile) return;

    // 1. Create the new state object
    const newSettings: ReminderSettingsType = {
        ...settings,
        [key]: {
            ...(settings[key] as any),
            [field]: value
        }
    };
    
    // 2. Optimistically update local UI state immediately
    setSettings(newSettings);
    
    // 3. Asynchronously save to Firestore
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        reminderSettings: newSettings,
      });

      // 4. Update the shared context to ensure consistency across the app
      setUserProfile(currentProfile => currentProfile ? ({ ...currentProfile, reminderSettings: newSettings }) : null);

      toast({ title: 'Podešavanja sačuvana!' });
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
      toast({
        variant: 'destructive',
        title: 'Greška',
        description: 'Nije moguće sačuvati podešavanja.',
      });
      // 5. Revert UI and context on error
      const revertedSettings = userProfile.reminderSettings || defaultSettings;
      setSettings(revertedSettings);
      setUserProfile(currentProfile => currentProfile ? ({...currentProfile, reminderSettings: revertedSettings}) : null);
    }
  }, [user, userProfile, settings, toast, setUserProfile]);


  const ReminderRow = ({
    label,
    settingKey,
  }: {
    label: string;
    settingKey: keyof ReminderSettingsType;
  }) => {
    const setting = settings[settingKey];
    // We can now safely assume `daysBefore` exists due to type and migration logic
    const hasDaysSelector = 'daysBefore' in setting;

    return (
      <div className="flex flex-col space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
        <div className="flex items-center justify-between">
          <Label className="font-semibold text-base">{label}</Label>
          <Switch
            checked={setting.enabled}
            onCheckedChange={(checked) => handleSettingChange(settingKey, 'enabled', checked)}
          />
        </div>
        {hasDaysSelector && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>{t('reminders_notify_me')}</p>
            <div className="flex items-center gap-2">
              <Select
                value={String((setting as any).daysBefore)}
                onValueChange={(value) => handleSettingChange(settingKey, 'daysBefore', Number(value))}
                disabled={!setting.enabled}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 5, 7].map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>{t('reminders_days_before')}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('reminders_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReminderRow label={t('reminders_period_label')} settingKey="nextPeriod" />
        <ReminderRow label={t('reminders_fertile_label')} settingKey="fertileWindow" />
        <ReminderRow label={t('reminders_ovulation_label')} settingKey="ovulation" />
      </CardContent>
    </Card>
  );
}
