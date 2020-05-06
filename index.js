const express = require('express')

const server = express()
server.use(express.json())

let requisitionsCount = 0

let projects = [
  {
    id: "0",
    title: "A cool project",
    tasks: ["Task 1", "Task 2"]
  }
]

function verifyIdExistence (req, res, next) {
  let { id } = req.params

  const project = projects.find(p => p.id === id)

  if (!project) {
    return res.status(400).json({error: 'Project not found'})
  }

  return next()
}

server.use((res, req, next) => {
  requisitionsCount += 1
  console.log(`Requisitions count: ${requisitionsCount}`)
  return next()
})

server.post('/projects', (req, res) => {

  let project = req.body
  let id = project.id

  let projectWithId = projects.find(p => p.id === id)

  if (!projectWithId) {
    projects.push(project)
    return res.json(projects)
  }

  return res.status(400).json({error: 'A project with this ID has been exists'})
})

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.put('/projects/:id', verifyIdExistence, (req, res) => {
  let { id } = req.params
  let { title } = req.body

  const project = projects.find(p => p.id === id)

  project.title = title

  return res.json(projects)
})

server.delete('/projects/:id', verifyIdExistence, (req, res) => {
  let { id } = req.params

  const index = projects.findIndex(p => p.id === id)

  projects.splice(index, 1)
  return res.send('')
})

server.post('/projects/:id/tasks', verifyIdExistence, (req, res) => {
  const { id } = req.params
  const task = req.body.title

  const project = projects.find(p => p.id === id)
  project.tasks.push(task)

  return res.json(projects)
})

server.listen(3000)