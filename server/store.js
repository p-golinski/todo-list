const storage = require('azure-storage')
const uuid = require('uuid')
const retryOperation = new storage.LinearRetryPolicyFilter();
const service = storage.createTableService()
const table = 'tasks'

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const addTask = async ({ title, description }) => (
  new Promise((resolve, reject) => {
    const gen = storage.TableUtilities.entityGenerator
    console.log('addtask - gen')
    const task = {
      PartitionKey: gen.String('task'),
      RowKey: gen.String(uuid.v4()),
      title,
      description
    }
    console.log('addtask - task')
    service.insertEntity(table, task, (error) => {
      if(error) {
        console.log(error);
      }
      !error ? resolve() : reject()
    })
    console.log('addtask - insertEntity')
  })
  ,console.log('addtask - Promise')
)

const listTasks = async () => (
  new Promise((resolve, reject) => {
    const query = new storage.TableQuery()
      .select(['title'])
      .where('PartitionKey eq ?', 'task')

    service.queryEntities(table, query, null, (error, result) => {
      !error ? resolve(result.entries.map((entry) => ({
        title: entry.title._
      }))) : reject()
    })
  })
)

const deleteTask = async ({ id }) => (
  new Promise((resolve, reject) => {
    const gen = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: gen.String('task'),
      RowKey: gen.String(id)
    }

    service.deleteEntity(table, task, (error) => {
      !error ? resolve() : reject()
    })
  })
)

module.exports = {
  init,
  addTask,
  listTasks,
  deleteTask
}
