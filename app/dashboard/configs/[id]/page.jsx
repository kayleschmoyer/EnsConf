'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Save, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import yaml from 'yaml'
import { useToast } from '@/components/ui/use-toast'

export default function ConfigEditorPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [config, setConfig] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('yaml')

  useEffect(() => {
    fetchConfig()
  }, [params.id])

  const fetchConfig = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/garages/${params.id}`
      )
      setConfig(response.data)
      const yamlContent = yaml.stringify({
        garage_id: response.data._id,
        name: response.data.name,
        levels: response.data.levels,
        total_spaces: response.data.totalSpaces,
        cameras: response.data.cameras || [],
        sensors: response.data.sensors || [],
      })
      setCode(yamlContent)
    } catch (error) {
      console.error('Failed to fetch config:', error)
      // Demo config
      const demoConfig = {
        garage_id: params.id,
        name: 'Demo Garage',
        levels: 3,
        total_spaces: 150,
        cameras: [
          {
            id: 'cam1',
            ip: '192.168.1.101',
            direction: 'inbound',
            roi: [[100, 200], [300, 400]],
          },
        ],
      }
      setCode(yaml.stringify(demoConfig))
    }
  }

  const handleSave = async () => {
    try {
      const parsedConfig = yaml.parse(code)
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/garages/${params.id}`,
        parsedConfig
      )
      toast({
        title: 'Saved!',
        description: 'Configuration updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `garage-config-${params.id}.yaml`
    a.click()
  }

  const handlePushToGitHub = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/github/push`, {
        garageId: params.id,
        content: code,
      })
      toast({
        title: 'Pushed to GitHub!',
        description: 'Configuration uploaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to push to GitHub',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold neon-text mb-2">
              Config Editor
            </h1>
            <p className="text-gray-400">Edit garage configuration file</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLanguage(language === 'yaml' ? 'json' : 'yaml')}>
              Switch to {language === 'yaml' ? 'JSON' : 'YAML'}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePushToGitHub}>
              <Github className="w-4 h-4 mr-2" />
              Push to GitHub
            </Button>
            <Button variant="neon" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-0 h-[calc(100vh-250px)]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none rounded-lg"
          spellCheck="false"
          style={{ tabSize: 2 }}
        />
      </Card>
    </div>
  )
}
