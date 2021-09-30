import {
  isSomeValueTrueInObject,
  makeFieldNegative,
  substract,
  transformUserIdentifier
} from '../../src/utils/utils'

describe('isSomeValueTrueInObject return ', () => {
  const stateTrue = {
    wall: true,
    comments: true,
    photos: false,
  }
  const stateFalse = {
    wall: false,
    comments: false,
    photos: false,
  }
  test(`true if some field is true`, () => {
    expect(isSomeValueTrueInObject(stateTrue)).toEqual(true)
  })
  test(`false if all fields are false`, () => {
    expect(isSomeValueTrueInObject(stateFalse)).toEqual(false)
  })
})

describe('makeFieldNegative ', () => {
  const state = {
    a: 1,
    b: 3,
    c: '4',
  }

  test(`changes number field value to opposite`, () => {
    expect(makeFieldNegative(state, 'a')).toEqual({ ...state, a: -1 })
  })
  test(`changes number in string field value to opposite`, () => {
    expect(makeFieldNegative(state, 'c')).toEqual({ ...state, c: -4 })
  })
  test(`does nothing if field does not existing in object`, () => {
    expect(makeFieldNegative(state, 'w')).toEqual(state)
  })
})

describe('substract ', () => {
  const minuend = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
  const subtrahendA = [{ id: 1 }, { id: 3 }]
  const subtrahendB = [{ id: 10 }, { id: 20 }]
  const difference = [{ id: 2 }, { id: 4 }]

  test(`subtracts correctly`, () => {
    expect(substract(minuend, subtrahendA, 'id')).toEqual(difference)
  })
  test(`returns the original array if there is no intersection`, () => {
    expect(substract(minuend, subtrahendB, 'id')).toEqual(minuend)
  })
})

describe('transformUserIdentifier ', () => {
   
  
  test(`transforms string only with number correctly`, () => {
    expect(transformUserIdentifier('12345')).toEqual('12345')
  })

  test(`transforms string with number with id prefix correctly`, () => {
    expect(transformUserIdentifier('id12345')).toEqual('12345')
  })

  test(`transforms link identifier correctly`, () => {
    expect(transformUserIdentifier('https://vk.com/id12345')).toEqual('12345')
    expect(transformUserIdentifier('https://vk.com/asdfg')).toEqual('asdfg')
  })
  
})

