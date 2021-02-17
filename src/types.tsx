import firebase from 'firebase'

export interface Company {
  name: string
  address: string
  phone: string
  logoURL?: string
  stampURL?: string
  website?: string
  email?: string
  contacts?: string[]
  bin?: string
  bank?: BankDetail
  currency?: string // kzt usd rub eur
  createdAt?: firebase.firestore.Timestamp
  updatedAt?: firebase.firestore.Timestamp
  createdById: string
}

export interface CompanyForm {
  name: string
  address: string
  phone: string
  logoURL?: string
  logo?: object
  stamp?: object
  stampURL?: string
  website?: string
  email?: string
  contacts?: string[]
  bin?: string
  bank?: BankDetail
  createdAt?: firebase.firestore.Timestamp
  updatedAt?: firebase.firestore.Timestamp 
  currency?: string // kzt usd rub eur
}

export interface BankDetail {
  bin: string
  bic: string
  name: string
  iban: string
  kbe: string
}

export interface Offer {
  createdById: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  companyId: string
  isTemplate: boolean
  isDraft: boolean
  orders?: string[]
  clientId?: string
  delivery?: string
  notes?: string
  shipTo?: string
  createdAt: firebase.firestore.Timestamp
  updatedAt?: firebase.firestore.Timestamp
}

export interface OfferForm {
  discount: number
  shipping: number
  total: number
  isTemplate: boolean
  isDraft: boolean
  orders: Order[]
  clientId: string
  delivery?: string
  notes?: string
  shipTo?: string
}

export type WithID<T> = T & { id: string }
export interface Client {
  id: string
  createdById: string
  iin: string
  companyName: string
  email: string
  phone: string
  address: string
  contacts: string[]
  offers: number
  createdAt: firebase.firestore.Timestamp
  updatedAt?: firebase.firestore.Timestamp
  ltv: number
  tags: string[]
}

export interface ClientForm {
  iin: string
  companyName: string
  email: string
  phone: string
  address: string
  contacts: string[]
  offers: number
  ltv: number
  tags: string[]
}

export interface Product {
  id: string
  createdById: string
  price: number
  name: string
  unit: Unit
  description: string
  photoURL: string
  url: string
  createdAt: firebase.firestore.Timestamp
  updatedAt?: firebase.firestore.Timestamp
  ltv: number
  offers: number
  tags: string[]
}

export interface ProductForm {
  price: number
  name: string
  unit: Unit
  description: string
  photoURL: string
  url: string
  ltv: number
  offers: number
  tags: string[]
}

export enum Unit {
  pcs = 1,
  litres = 2,
  kg = 3,
  pairs = 4,
  box = 5,
  service = 6
}
export interface Order {
  productId: string
  qty: number
}

export class Fb {
  createCompany () {}
  updateCompany () {}

  createClient () {}
  updateClient () {}
  removeClient () {}

  createProduct () {}
  updateProduct () {}
  removeProduct () {}

  createOffer () {}
  updateOffer () {}
  removeOffer () {}
  cloneOffer () {}
  sendToEmail () {}
}
