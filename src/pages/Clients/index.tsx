import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase/app'
import {
  Alert,
  Spinner,
  SideSheet,
  Pane,
  toaster,
  Button
} from 'evergreen-ui'
import { Client, ClientForm, WithID } from 'src/types'
import React, { useState } from 'react'
import Table from './table'
import Form from './form'

export default function Page () {
  const currentUser = firebase.auth().currentUser
  const [visible, setVisible] = useState(false)
  const [values, loading] = useCollectionData<WithID<Client>>(
    firebase.firestore().collection('clients').where('createdById', '==', currentUser.uid),
    {
      idField: 'id'
    }
  )

  async function handleSubmit (val: ClientForm) {
    setVisible(false)
    const newItem = {
      ...val,
      createdAt: new Date(),
      createdById: currentUser.uid
    }
    await firebase.firestore().collection('clients').add(newItem)
  }

  async function handleRemove (val: WithID<Client>) {
    if (window.confirm('Are you sure?')) {
      try {
        await firebase.firestore().collection('clients').doc(val.id).delete()
        toaster.success('Removed')
      } catch (e) {
        toaster.danger(e.message)
      }
    }
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

  return (
    <Pane paddingX={200} display='flex' flex={1} flexDirection='column'>
      <Pane>
        <h1>Clieiints page</h1>
        <Pane justifyContent='space-between' flexDirection='row' display='flex'>
          <Button
            onClick={() => setVisible(true)}
            appearance='primary'
            intent='success'
            height={44}
            marginRight={16}
          >
            Создать запись
          </Button>
          <Alert
            appearance='card'
            intent='success'
            title={`Загружено ${values.length} записей`}
            marginBottom={12}
            alignSelf='flex-start'
          />
        </Pane>
      </Pane>
      <SideSheet isShown={visible} onCloseComplete={() => setVisible(false)}>
        <Form onSubmit={handleSubmit} />
      </SideSheet>
      {values && <Table onRemove={handleRemove} data={values} />}
    </Pane>
  )
}
