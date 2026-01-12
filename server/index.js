const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const socketIo = require('socket.io')
const yaml = require('yaml')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage })

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/garage-config'

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.log('⚠️  MongoDB connection failed, using in-memory fallback:', err.message)
  })

// Garage Schema
const garageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    levels: { type: Number, required: true },
    totalSpaces: { type: Number, required: true },
    spotsPerLevel: { type: Number, default: 50 },
    entrances: { type: Number, default: 1 },
    exits: { type: Number, default: 1 },
    cameras: [
      {
        id: String,
        ip: String,
        direction: String,
        roi: [[Number]],
        position: [Number],
      },
    ],
    sensors: [
      {
        id: String,
        position: [Number],
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
    occupancy: { type: Number, default: 0 },
    version: { type: String, default: '1.0.0' },
  },
  { timestamps: true }
)

const Garage = mongoose.model('Garage', garageSchema)

// In-memory fallback
let inMemoryGarages = []
const useInMemory = !mongoose.connection.readyState

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id)
  })

  socket.on('subscribe-garage', (garageId) => {
    socket.join(`garage-${garageId}`)
    console.log(`📡 Client subscribed to garage-${garageId}`)
  })
})

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// Get all garages
app.get('/api/garages', async (req, res) => {
  try {
    if (useInMemory) {
      return res.json(inMemoryGarages)
    }
    const garages = await Garage.find().sort({ createdAt: -1 })
    res.json(garages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single garage
app.get('/api/garages/:id', async (req, res) => {
  try {
    if (useInMemory) {
      const garage = inMemoryGarages.find((g) => g._id === req.params.id)
      return res.json(garage || {})
    }
    const garage = await Garage.findById(req.params.id)
    if (!garage) {
      return res.status(404).json({ error: 'Garage not found' })
    }
    res.json(garage)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create garage
app.post('/api/garages', async (req, res) => {
  try {
    if (useInMemory) {
      const newGarage = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      inMemoryGarages.push(newGarage)
      io.emit('garage-created', newGarage)
      return res.status(201).json(newGarage)
    }

    const garage = new Garage(req.body)
    await garage.save()

    // Emit real-time event
    io.emit('garage-created', garage)

    res.status(201).json(garage)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update garage
app.put('/api/garages/:id', async (req, res) => {
  try {
    if (useInMemory) {
      const index = inMemoryGarages.findIndex((g) => g._id === req.params.id)
      if (index !== -1) {
        inMemoryGarages[index] = {
          ...inMemoryGarages[index],
          ...req.body,
          updatedAt: new Date(),
        }
        io.to(`garage-${req.params.id}`).emit('garage-updated', inMemoryGarages[index])
        return res.json(inMemoryGarages[index])
      }
      return res.status(404).json({ error: 'Garage not found' })
    }

    const garage = await Garage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!garage) {
      return res.status(404).json({ error: 'Garage not found' })
    }

    // Emit real-time event
    io.to(`garage-${req.params.id}`).emit('garage-updated', garage)

    res.json(garage)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete garage
app.delete('/api/garages/:id', async (req, res) => {
  try {
    if (useInMemory) {
      inMemoryGarages = inMemoryGarages.filter((g) => g._id !== req.params.id)
      io.emit('garage-deleted', req.params.id)
      return res.json({ message: 'Garage deleted' })
    }

    const garage = await Garage.findByIdAndDelete(req.params.id)
    if (!garage) {
      return res.status(404).json({ error: 'Garage not found' })
    }

    // Emit real-time event
    io.emit('garage-deleted', req.params.id)

    res.json({ message: 'Garage deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export config as YAML
app.get('/api/garages/:id/export', async (req, res) => {
  try {
    let garage
    if (useInMemory) {
      garage = inMemoryGarages.find((g) => g._id === req.params.id)
    } else {
      garage = await Garage.findById(req.params.id)
    }

    if (!garage) {
      return res.status(404).json({ error: 'Garage not found' })
    }

    const config = {
      garage_id: garage._id,
      name: garage.name,
      levels: garage.levels,
      total_spaces: garage.totalSpaces,
      cameras: garage.cameras || [],
      sensors: garage.sensors || [],
      status: garage.status,
      version: garage.version,
    }

    const format = req.query.format || 'yaml'
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=garage-${garage._id}.json`
      )
      res.send(JSON.stringify(config, null, 2))
    } else {
      const yamlContent = yaml.stringify(config)
      res.setHeader('Content-Type', 'text/yaml')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=garage-${garage._id}.yaml`
      )
      res.send(yamlContent)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload camera image
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    res.json({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GitHub integration (push config)
app.post('/api/github/push', async (req, res) => {
  try {
    const { garageId, content } = req.body
    const token = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPO_NAME
    const owner = process.env.GITHUB_REPO_OWNER

    if (!token || !repo || !owner) {
      return res.status(400).json({
        error: 'GitHub configuration missing. Please set environment variables.',
      })
    }

    // In a real implementation, you would use the GitHub API here
    // For now, we'll just acknowledge the request
    res.json({
      message: 'Config would be pushed to GitHub',
      repo: `${owner}/${repo}`,
      file: `configs/garage-${garageId}.yaml`,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start server
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Socket.io ready for real-time updates`)
  console.log(`🗄️  Using ${useInMemory ? 'in-memory' : 'MongoDB'} storage`)
})

module.exports = { app, server, io }
