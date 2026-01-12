'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    githubToken: '',
    githubRepo: '',
    mongodbUri: '',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  })

  const handleSave = () => {
    // Save to localStorage as backup
    localStorage.setItem('app-settings', JSON.stringify(settings))
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated',
    })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold neon-text mb-2">Settings</h1>
        <p className="text-gray-400">Configure your application</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="hologram">
          <CardHeader>
            <CardTitle>GitHub Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Personal Access Token</Label>
              <Input
                type="password"
                value={settings.githubToken}
                onChange={(e) =>
                  setSettings({ ...settings, githubToken: e.target.value })
                }
                placeholder="ghp_xxxxxxxxxxxx"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Repository</Label>
              <Input
                value={settings.githubRepo}
                onChange={(e) =>
                  setSettings({ ...settings, githubRepo: e.target.value })
                }
                placeholder="username/repo-name"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hologram">
          <CardHeader>
            <CardTitle>Database</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>MongoDB URI</Label>
            <Input
              type="password"
              value={settings.mongodbUri}
              onChange={(e) =>
                setSettings({ ...settings, mongodbUri: e.target.value })
              }
              placeholder="mongodb+srv://..."
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="hologram">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>API URL</Label>
            <Input
              value={settings.apiUrl}
              onChange={(e) =>
                setSettings({ ...settings, apiUrl: e.target.value })
              }
              placeholder="http://localhost:3001"
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Button variant="neon" onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
