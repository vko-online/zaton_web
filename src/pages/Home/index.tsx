import firebase from 'firebase/app'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'src/services/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { WithID, Company, CompanyForm } from 'src/types'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Pane, Spinner, Avatar, Image, FormField, FilePicker, Button, TextInputField, toaster } from 'evergreen-ui'

const schema = yup.object({
  name: yup.string().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
  logo: yup.mixed().notRequired(),
  stamp: yup.mixed().notRequired(),
  website: yup.string().notRequired(),
  email: yup.string().email().notRequired(),
  contacts: yup.array(yup.string()),
  bin: yup.string().notRequired(),
  currency: yup.string().notRequired()
})
const defaultValues: CompanyForm = {
  name: '',
  address: '',
  phone: '',
  website: '',
  email: '',
  contacts: [],
  bin: '',
  currency: '₸'
}

export default function Page () {
  const currentUser = firebase.auth().currentUser
  const [values, loading] = useDocumentData<WithID<Company>>(
    firebase.firestore().doc(`companies/${currentUser.uid}`),
    {
      idField: 'id'
    }
  )

  async function handleUpload (key: string, val) {
    console.log('handleUpload', key)
    const ref = firebase.storage().ref(`company_files/${currentUser.uid}`)
    const child = ref.child(key)
    if (val) {
      await child.put(val)
      console.log('handleUpload success', key)
      return await child.getDownloadURL()
    }
  }

  async function handleUploadRemove (key: string) {
    console.log('handleUploadRemove', key)
    const ref = firebase.storage().ref(`company_files/${currentUser.uid}`)
    const child = ref.child(key)
    const exist = await child.getDownloadURL()
    if (exist) {
      await child.delete()
      console.log('handleUploadRemove success', key)
    }
  }

  const formik = useFormik<CompanyForm>({
    initialValues: {
      ...defaultValues,
      ...values
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: handleSave
  })

  async function handleSave (val: CompanyForm) {
    try {
      if (val.logo && val.logoURL) {
        console.log('try to remove old')
        // await handleUploadRemove('logo')
      }
      if (val.stamp && val.stampURL) {
        console.log('try to remove old')
        // await handleUploadRemove('stamp')
      }
      const logoURL = await handleUpload('logo', val.logo)
      const stampURL = await handleUpload('stamp', val.stamp)
      console.log('logoURL', logoURL)
      const newItem = {
        name: val.name,
        address: val.address,
        phone: val.phone,
        email: val.email,
        website: val.website,
        bin: val.bin,
        currency: val.currency,
        contacts: val.contacts,
        createdById: currentUser.uid,
        createdAt: val.createdAt || new Date(),
        logoURL,
        stampURL
      }
      await firebase.firestore().doc(`companies/${currentUser.uid}`).set(newItem)
      toaster.success('Успешно сохранено')
    } catch (e) {
      console.log('handleSave', e)
    }
  }

  const handleFileChange: any = async (key, val) => {
    await formik.setFieldValue(key, val)
  }

  if (loading) {
    return (
      <Pane
        flex={1}
        display='flex'
        alignItems='center'
        justifyContent='center'
        height={400}
      >
        <Spinner />
      </Pane>
    )
  }

  if (!currentUser) {
    return (
      <Pane display='flex' flex={1} alignItems='center' justifyContent='center'>
        <h1>Welcome to offero</h1>
      </Pane>
    )
  }

  return (
    <>
      <Pane display='flex' alignItems='center' flexDirection='column' flex={1} paddingTop={100}>
        <TextInputField
          isInvalid={formik.touched.name && !!formik.errors.name}
          required
          value={formik.values.name}
          onChange={formik.handleChange}
          name='name'
          label='Название'
          validationMessage={
            formik.touched.name && formik.errors.name
          }
        />
        <TextInputField
          isInvalid={formik.touched.address && !!formik.errors.address}
          required
          value={formik.values.address}
          onChange={formik.handleChange}
          name='address'
          label='Адрес'
          validationMessage={
            formik.touched.address && formik.errors.address
          }
        />
        <TextInputField
          isInvalid={formik.touched.phone && !!formik.errors.phone}
          required
          value={formik.values.phone}
          onChange={formik.handleChange}
          name='phone'
          label='Телефон'
          validationMessage={
            formik.touched.phone && formik.errors.phone
          }
        />
        <TextInputField
          isInvalid={formik.touched.website && !!formik.errors.website}
          value={formik.values.website}
          onChange={formik.handleChange}
          name='website'
          label='Веб-сайт'
          validationMessage={
            formik.touched.website && formik.errors.website
          }
        />
        <TextInputField
          isInvalid={formik.touched.email && !!formik.errors.email}
          value={formik.values.email}
          onChange={formik.handleChange}
          name='email'
          label='Email'
          validationMessage={
            formik.touched.email && formik.errors.email
          }
        />
        <TextInputField
          isInvalid={formik.touched.bin && !!formik.errors.bin}
          value={formik.values.bin}
          onChange={formik.handleChange}
          name='bin'
          label='БИН'
          validationMessage={
            formik.touched.email && formik.errors.bin
          }
        />
        <TextInputField
          isInvalid={formik.touched.currency && !!formik.errors.currency}
          value={formik.values.currency}
          onChange={formik.handleChange}
          name='currency'
          label='Валюта'
          validationMessage={
            formik.touched.email && formik.errors.currency
          }
        />
        <Pane display='flex' flexDirection='row'>
          <Image width={64} height={64} src={formik.values.logoURL} />
          <FormField marginLeft={10} label='Логотип' marginBottom={24}>
            <FilePicker
              multiple={false}
              width={250}
              marginBottom={32}
              onChange={files => handleFileChange('logo', files[0])}
              placeholder='Выберите файл'
            />
          </FormField>
        </Pane>
        <Pane display='flex' flexDirection='row'>
          <Image width={64} height={64} src={formik.values.stampURL} />
          <FormField marginLeft={10} label='Печать' marginBottom={24}>
            <FilePicker
              multiple={false}
              width={250}
              marginBottom={32}
              onChange={files => handleFileChange('stamp', files[0])}
              placeholder='Выберите файл'
            />
          </FormField>
        </Pane>
        <Button type='submit' onClick={() => formik.handleSubmit()} appearance='primary'>Сохранить</Button>
      </Pane>
    </>
  )
}
