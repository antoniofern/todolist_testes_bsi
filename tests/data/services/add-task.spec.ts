import { AddTaskRepository } from '@/data/contracts'
import { AddTaskService } from '@/data/services'
import { Task } from '@/domain/entities'
import { mock, MockProxy } from 'jest-mock-extended'

const mockTask: Task = {
  title: 'any_title',
  description: 'any_description',
  isCompleted: false,
  isFavorite: false
}

describe('AddTaskService', () => {
  let taskRepositorySpy: MockProxy<AddTaskRepository>
  let sut: AddTaskService

  beforeAll(() => {
    taskRepositorySpy = mock<AddTaskRepository>()
  })

  beforeEach(() => {
    sut = new AddTaskService(taskRepositorySpy)
  })

  it('should call AddTaskRepository with correct params', async () => {
    await sut.handle(mockTask)

    expect(taskRepositorySpy.save).toHaveBeenCalledWith(mockTask)
  })

  it('should call Throws if AddTaskRepository throws', async () => {
    taskRepositorySpy.save.mockRejectedValueOnce(() => {
      throw new Error('any_error')
    })

    const promise = sut.handle(mockTask)

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
