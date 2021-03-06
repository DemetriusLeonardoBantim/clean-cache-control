import {CacheStore} from '@/data/protocols/cache'
import {LocalSavePurchases} from '@/data/usecases'
import { SavePurchases } from '@/domain'

class CacheStoreSpy implements CacheStore{
  deleteCallsCount = 0
  insertCallsCount = 0
  key:string
  insertKey:string
  insertValues: Array<SavePurchases.Params> = []

  delete (key:string): void{
    this.deleteCallsCount++
    this.key = key
  }

  insert(key:string, value:any):void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }


  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {throw new Error()})
  }

  simulateInserError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {throw new Error()})
  }

}


type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const mockPurchases = (): Array<SavePurchases.Params> => [{
  id:'1',
  date: new Date(),
  value:50
}, {
  id:'1',
  date: new Date(),
  value:50
}]


const makeSut = ():SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)
  return {
    cacheStore,
    sut
  }
}





describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const {cacheStore} = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  test('Should delete old cache on sut.save', async () => {
    const {cacheStore,sut} = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
  })
  test('Should call delete with correct key', async () => {
    const {cacheStore,sut} = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.key).toBe('puchases')
  })
  test('Should not insert new Cache if delete fails', async () => {
    const {cacheStore,sut} = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })
  test('Should insert new Cache if delete succeeds', async () => {
    const {cacheStore,sut} = makeSut()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
  })
  test('Should insert new Cache if delete succeeds', async () => {
    const {cacheStore,sut} = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

  test('Should throw if insert throws', async () => {
    const {cacheStore,sut} = makeSut()
    cacheStore.simulateInserError()
    const promise = sut.save(mockPurchases())
    expect(promise).rejects.toThrow()
  })

})