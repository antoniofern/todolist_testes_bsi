import { AddTaskController } from '@/application/controllers'
import { RequiredFieldError } from '@/application/errors'
import { AddTask } from '@/domain/features/add-task'
import { mock, MockProxy } from 'jest-mock-extended'

describe('AddTaskController', () => {
  let addTaskSpy: MockProxy<AddTask>
  let sut: AddTaskController

  beforeAll(() => {
    addTaskSpy = mock<AddTask>()
  })

  beforeEach(() => {
    sut = new AddTaskController(addTaskSpy)
  })

  it('should return 401 if task title is not defined in request', async () => {
    const result = await sut.handle({ description: 'any_description', isComplete: false, isFavorite: false })

    expect(result).toEqual({
      status: 401,
      data: { error: new RequiredFieldError('title') }
    })
  })

  it('should return 401 if task description is not defined in request', async () => {
    const result = await sut.handle({ title: 'any_title', isComplete: false, isFavorite: false })

    expect(result).toEqual({
      status: 401,
      data: { error: new RequiredFieldError('description') }
    })
  })

  it('should call AddTask with correct params', async () => {
    addTaskSpy.handle.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.handle({ title: 'any_title', description: 'any_description', isComplete: false, isFavorite: false })

    expect(addTaskSpy.handle).toHaveBeenCalledWith({ title: 'any_title', description: 'any_description', isComplete: false, isFavorite: false })
  })

  it('should return status code 200 with task id if AddTask completes successfully', async () => {
    addTaskSpy.handle.mockResolvedValueOnce({
      id: 'any_id'
    })

    const result = await sut.handle({ title: 'any_title', description: 'any_description', isComplete: false, isFavorite: false })

    expect(result).toEqual({ status: 200, data: { id: 'any_id' } })
  })

  it('should return status code 500 with internal error if AddTask throws', async () => {
    addTaskSpy.handle.mockRejectedValueOnce(new Error(''))

    const result = await sut.handle({ title: 'any_title', description: 'any_description', isComplete: false, isFavorite: false })

    expect(result).toEqual({ status: 500, data: { message: 'Internal Server Error' } })
  })
})
